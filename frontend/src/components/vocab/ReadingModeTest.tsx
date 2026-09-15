"use client";

import { useMemo, useState } from "react";
import { Check, PartyPopper, Volume2, X } from "lucide-react";
import { VOCAB_WORDS } from "@/lib/vocabData";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import type { VocabWordWithProgress } from "@/hooks/domain/useVocabProgress";

interface ReadingModeTestProps {
  words: VocabWordWithProgress[];
  nativeLanguage?: NativeLanguage;
  onMarkFamiliar: (id: string) => void;
  onFinish: () => void;
}

const CHOICE_COUNT = 4;

/** Deterministic shuffle so choices stay stable across re-renders. */
const shuffleBySeed = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed + 1;
  for (let i = result.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function ReadingModeTest({ words, nativeLanguage, onMarkFamiliar, onFinish }: ReadingModeTestProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const question = words[index];

  const choices = useMemo(() => {
    if (!question) return [];
    const pool = [...words, ...VOCAB_WORDS.filter((w) => !words.some((tw) => tw.id === w.id))];
    const distractors = pool.filter((w) => w.id !== question.id).map((w) => w.meaning);
    const picked = shuffleBySeed(distractors, index + 7).slice(0, CHOICE_COUNT - 1);
    return shuffleBySeed([question.meaning, ...picked], index + 13);
  }, [question, index, words]);

  if (!question || isDone) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <PartyPopper className="w-6 h-6 text-teal-600" />
          </div>
          <p className="text-lg font-bold text-gray-900 mb-1">Test Complete!</p>
          <p className="text-sm text-gray-500">
            You got <span className="font-semibold text-teal-600">{correctCount}</span> of {words.length} correct.
          </p>
          <p className="text-xs text-gray-400 mt-2 max-w-[260px]">
            Correct words moved to the Familiar tab. Words you missed stay in Unfamiliar for another round.
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

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.meaning) {
      setCorrectCount((c) => c + 1);
      onMarkFamiliar(question.id);
    }
  };

  const handleNext = () => {
    setSelected(null);
    if (index + 1 >= words.length) {
      setIsDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const isCorrect = selected === question.meaning;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>
            Question {index + 1} / {words.length}
          </span>
          <span>Choose the correct meaning</span>
        </div>
        <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${((index + (selected ? 1 : 0)) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{question.word}</h2>
          <button
            type="button"
            onClick={() => speak(question.word, "US")}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            {question.phonetic.us ? (
              <span className="font-mono">{question.phonetic.us}</span>
            ) : (
              <span className="italic text-gray-400">Listen</span>
            )}
            <Volume2 className="w-4 h-4 text-teal-600" />
          </button>
        </div>

        <div className="space-y-2">
          {choices.map((choice) => {
            const isAnswer = choice === question.meaning;
            const isPicked = choice === selected;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleSelect(choice)}
                disabled={!!selected}
                className={cn(
                  "w-full flex items-start gap-2 p-3 rounded-xl border text-left text-sm transition-colors",
                  !selected && "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50",
                  selected && isAnswer && "border-teal-400 bg-teal-50 text-teal-900",
                  selected && isPicked && !isAnswer && "border-rose-300 bg-rose-50 text-rose-900",
                  selected && !isAnswer && !isPicked && "border-gray-100 text-gray-400"
                )}
              >
                {selected && isAnswer && <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
                {selected && isPicked && !isAnswer && <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                <span className="flex-1">{choice}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-3",
              isCorrect ? "border-teal-200 bg-teal-50" : "border-rose-200 bg-rose-50"
            )}
          >
            <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-teal-800" : "text-rose-800")}>
              {isCorrect ? "Correct! Moved to Familiar." : "Not quite — keep this one in Unfamiliar."}
            </p>
            {question.definitions[0] ? (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="text-gray-400 mr-1">[{question.definitions[0].pos}]</span>
                  {question.definitions[0].text}
                </p>
                {nativeLanguage && question.definitions[0].translation[nativeLanguage] && (
                  <p className="text-xs text-gray-400 leading-relaxed mt-1 pl-[1.2em]">
                    {question.definitions[0].translation[nativeLanguage]}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-600 leading-relaxed">{question.meaning}</p>
            )}
            {question.examples[0] && (
              <>
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{question.examples[0].text}</p>
                {nativeLanguage && question.examples[0].translation[nativeLanguage] && (
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">
                    {question.examples[0].translation[nativeLanguage]}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t shrink-0">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          className="w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {index + 1 >= words.length ? "See Results" : "Next"}
        </button>
      </div>
    </div>
  );
}
