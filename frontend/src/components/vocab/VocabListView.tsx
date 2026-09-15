"use client";

import { useState } from "react";
import { BookMarked, ChevronRight, Headphones, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ScoreRing } from "@/components/growth-report/ScoreRing";
import type { VocabWordWithProgress } from "@/hooks/domain/useVocabProgress";
import { cn } from "@/lib/utils";

type ListTab = "unfamiliar" | "familiar";

interface VocabListViewProps {
  mode: "reading" | "listening";
  unfamiliarWords: VocabWordWithProgress[];
  familiarWords: VocabWordWithProgress[];
  familiarCount: number;
  totalCount: number;
  onSelectWord: (word: VocabWordWithProgress) => void;
  onStartTest: () => void;
}

export function VocabListView({
  mode,
  unfamiliarWords,
  familiarWords,
  familiarCount,
  totalCount,
  onSelectWord,
  onStartTest,
}: VocabListViewProps) {
  const [tab, setTab] = useState<ListTab>("unfamiliar");

  const words = tab === "unfamiliar" ? unfamiliarWords : familiarWords;
  const percent = totalCount === 0 ? 0 : Math.round((familiarCount / totalCount) * 100);
  const TestIcon = mode === "reading" ? ListChecks : Headphones;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
          <BookMarked className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">My Vocab List</p>
          <p className="text-xs text-gray-500">
            Familiar {familiarCount} / {totalCount}
          </p>
        </div>
        <ScoreRing score={percent} color="#0EA5E9" size={52} strokeWidth={4} label="%" />
      </div>

      <div className="flex items-center gap-4 px-4 border-b shrink-0">
        {(["unfamiliar", "familiar"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors capitalize",
              tab === id ? "text-gray-900 border-teal-500" : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 shrink-0">
        <span>Total {words.length} Words</span>
        <span>Recently Added</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {words.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title={tab === "unfamiliar" ? "All words mastered!" : "No familiar words yet"}
            description={
              tab === "unfamiliar"
                ? "Every word in this list has moved to Familiar. Great work!"
                : "Pass a word test and the word will move here automatically."
            }
          />
        ) : (
          <ul className="divide-y">
            {words.map((word) => (
              <li key={word.id}>
                <button
                  type="button"
                  onClick={() => onSelectWord(word)}
                  className="w-full flex items-center gap-2 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-1 text-sm text-gray-900 truncate">{word.word}</span>
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full border shrink-0",
                      word.revised ? "border-teal-200 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500"
                    )}
                  >
                    {word.revised ? "Revised" : "Not Revised"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t bg-white shrink-0">
        <button
          type="button"
          onClick={onStartTest}
          disabled={unfamiliarWords.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          <TestIcon className="w-4 h-4" />
          {mode === "reading" ? "Start Meaning Test" : "Start Spelling Test"}
          {unfamiliarWords.length > 0 && ` (${unfamiliarWords.length})`}
        </button>
      </div>
    </div>
  );
}
