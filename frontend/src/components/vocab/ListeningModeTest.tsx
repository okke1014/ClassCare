"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PartyPopper, Volume2, XCircle } from "lucide-react";
import { speak, type Accent } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import type { VocabWordWithProgress } from "@/hooks/domain/useVocabProgress";

interface ListeningModeTestProps {
  words: VocabWordWithProgress[];
  nativeLanguage?: NativeLanguage;
  onMarkFamiliar: (id: string) => void;
  onFinish: () => void;
}

export function ListeningModeTest({ words, nativeLanguage, onMarkFamiliar, onFinish }: ListeningModeTestProps) {
  const [accent, setAccent] = useState<Accent>("US");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const question = words[index];

  useEffect(() => {
    if (isDone || submitted !== null || !question) return;
    speak(question.word, accent);
  }, [question?.id, submitted, isDone, accent]);

  if (!question || isDone) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <PartyPopper className="w-6 h-6 text-teal-600" />
          </div>
          <p className="text-lg font-bold text-gray-900 mb-1">Test Complete!</p>
          <p className="text-sm text-gray-500">
            You spelled <span className="font-semibold text-teal-600">{correctCount}</span> of {words.length} correctly.
          </p>
          <p className="text-xs text-gray-400 mt-2 max-w-[260px]">
            Correctly spelled words moved to the Familiar tab.
          </p>
        </div>
        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t shrink-0">
          <button
            type="button"
            onClick={onFinish}
            className="w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
          >
            Back to Vocab List
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = submitted !== null && submitted.trim().toLowerCase() === question.word.toLowerCase();

  const handleSubmit = () => {
    if (!answer.trim() || submitted !== null) return;
    setSubmitted(answer);
    if (answer.trim().toLowerCase() === question.word.toLowerCase()) {
      setCorrectCount((c) => c + 1);
      onMarkFamiliar(question.id);
    }
  };

  const handleNext = () => {
    setSubmitted(null);
    setAnswer("");
    if (index + 1 >= words.length) {
      setIsDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            Question {index + 1} / {words.length}
          </span>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">Accent:</span>
            {(["UK", "US"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAccent(a)}
                className={cn(
                  "px-2 py-0.5 rounded-full border transition-colors",
                  accent === a ? "border-teal-400 bg-teal-50 text-teal-700 font-medium" : "border-gray-200 text-gray-500"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${((index + (submitted !== null ? 1 : 0)) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {submitted === null ? (
          <>
            <p className="text-xs text-gray-500 text-center mb-4">
              Listen to the word, then type the spelling.
            </p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter Word"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full px-4 py-3 rounded-full border border-gray-300 text-center text-base outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors"
            />
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => speak(question.word, accent)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Play
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="flex-1 py-3 rounded-full bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-full border mb-4",
                isCorrect ? "border-teal-400 bg-teal-50" : "border-rose-300 bg-rose-50"
              )}
            >
              <span className={cn("text-base font-semibold", isCorrect ? "text-teal-800" : "text-rose-800")}>
                {submitted}
              </span>
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
            </div>

            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-2xl font-bold text-teal-600">{question.word}</h2>
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
                  isCorrect ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700"
                )}
              >
                {isCorrect ? "Familiar" : "Unfamiliar"}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              {(["UK", "US"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => speak(question.word, a)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <span className="text-gray-400">[{a}]</span>
                  {question.phonetic.uk || question.phonetic.us ? (
                    <span className="font-mono">{a === "UK" ? question.phonetic.uk : question.phonetic.us}</span>
                  ) : (
                    <span className="italic text-gray-400">Listen</span>
                  )}
                  <Volume2 className="w-4 h-4 text-teal-600" />
                </button>
              ))}
            </div>

            {question.definitions.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <p className="text-xs text-gray-400 mb-2">Definitions</p>
                <div className="space-y-3">
                  {question.definitions.map((def, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="text-gray-400 mr-1.5">[{def.pos}]</span>
                        {def.text}
                      </p>
                      {nativeLanguage && def.translation[nativeLanguage] && (
                        <p className="text-xs text-gray-400 leading-relaxed mt-1 pl-[1.6em]">
                          {def.translation[nativeLanguage]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.examples.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 mb-2">Examples</p>
                <div className="space-y-3">
                  {question.examples.map((example, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 leading-relaxed">{example.text}</p>
                      {nativeLanguage && example.translation[nativeLanguage] && (
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">
                          {example.translation[nativeLanguage]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.definitions.length === 0 && question.examples.length === 0 && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 mb-2">Meaning</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
                  {question.meaning}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {submitted !== null && (
        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t shrink-0">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
          >
            {index + 1 >= words.length ? "See Results" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
