"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { StudentNav } from "@/components/StudentNav";
import { VocabListView } from "@/components/vocab/VocabListView";
import { ReadingModeTest } from "@/components/vocab/ReadingModeTest";
import { ListeningModeTest } from "@/components/vocab/ListeningModeTest";
import { WordDetailView } from "@/components/vocab/WordDetailView";
import { useVocabProgress, type VocabWordWithProgress } from "@/hooks/domain/useVocabProgress";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { cn } from "@/lib/utils";

type Mode = "reading" | "listening";
type Screen = "list" | "test" | "word";

const MODES: { id: Mode; label: string }[] = [
  { id: "reading", label: "Reading Mode" },
  { id: "listening", label: "Listening Mode" },
];

export default function VocabPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("reading");
  const [screen, setScreen] = useState<Screen>("list");
  const [selectedWord, setSelectedWord] = useState<VocabWordWithProgress | null>(null);
  const [testWords, setTestWords] = useState<VocabWordWithProgress[]>([]);
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>("ko");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setNativeLanguage(user.username === "student1" ? "ja" : "ko");
    }
  }, []);

  const {
    unfamiliarWords,
    familiarWords,
    familiarCount,
    totalCount,
    markFamiliar,
    markUnfamiliar,
    enrichWord,
  } = useVocabProgress();

  const enrichAttempted = useRef(new Set<string>());
  useEffect(() => {
    const incomplete = [...unfamiliarWords, ...familiarWords].filter(
      (w) => w.id.startsWith("custom-") && (w.definitions?.length ?? 0) === 0 && !enrichAttempted.current.has(w.id)
    );
    for (const word of incomplete) {
      enrichAttempted.current.add(word.id);
      void enrichWord(word.word, nativeLanguage);
    }
  }, [unfamiliarWords, familiarWords, nativeLanguage, enrichWord]);

  const activeMode = MODES.find((m) => m.id === mode)!;

  const handleStartTest = () => {
    setTestWords(unfamiliarWords);
    setScreen("test");
  };

  const handleSelectWord = (word: VocabWordWithProgress) => {
    setSelectedWord(word);
    setScreen("word");
  };

  const handleBack = () => {
    if (screen === "list") {
      router.push("/student/dashboard");
      return;
    }
    setScreen("list");
  };

  const headerTitle =
    screen === "word" ? "Dictionary Lookup" : screen === "test" ? activeMode.label : "Vocab Books";

  return (
    <div className="h-dvh flex flex-col">
      <AppHeader title={headerTitle} onBack={handleBack} />

      {screen === "list" && (
        <>
          <div className="flex items-center gap-4 px-4 border-b shrink-0">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                  mode === m.id
                    ? "text-gray-900 border-teal-500"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            <VocabListView
              mode={mode}
              unfamiliarWords={unfamiliarWords}
              familiarWords={familiarWords}
              familiarCount={familiarCount}
              totalCount={totalCount}
              onSelectWord={handleSelectWord}
              onStartTest={handleStartTest}
            />
          </div>
          <StudentNav />
        </>
      )}

      {screen === "test" && (
        <div className="flex-1 overflow-hidden">
          {mode === "reading" ? (
            <ReadingModeTest
              words={testWords}
              nativeLanguage={nativeLanguage}
              onMarkFamiliar={markFamiliar}
              onFinish={() => setScreen("list")}
            />
          ) : (
            <ListeningModeTest
              words={testWords}
              nativeLanguage={nativeLanguage}
              onMarkFamiliar={markFamiliar}
              onFinish={() => setScreen("list")}
            />
          )}
        </div>
      )}

      {screen === "word" && selectedWord && (
        <div className="flex-1 overflow-hidden">
          <WordDetailView
            word={
              [...unfamiliarWords, ...familiarWords].find((w) => w.id === selectedWord.id) ?? selectedWord
            }
            nativeLanguage={nativeLanguage}
            onMarkFamiliar={(id) => {
              markFamiliar(id);
              setScreen("list");
            }}
            onMarkUnfamiliar={(id) => {
              markUnfamiliar(id);
              setScreen("list");
            }}
          />
        </div>
      )}
    </div>
  );
}
