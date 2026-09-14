"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Volume2, X } from "lucide-react";
import { findVocabWordByText } from "@/lib/vocabData";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { useVocabProgress, type VocabStatus } from "@/hooks/domain/useVocabProgress";

interface WordDictionaryPopupProps {
  word: string;
  nativeLanguage?: NativeLanguage;
  onClose: () => void;
}

export function WordDictionaryPopup({ word, nativeLanguage, onClose }: WordDictionaryPopupProps) {
  const { addWord, getStatus } = useVocabProgress();
  const curated = findVocabWordByText(word);

  const [meaning, setMeaning] = useState<string | null>(curated?.meaning ?? null);
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(!curated);
  const [meaningFailed, setMeaningFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [status, setStatus] = useState<VocabStatus | null>(() => getStatus(word));

  useEffect(() => {
    if (curated) return;
    let cancelled = false;
    setIsLoadingMeaning(true);
    setMeaningFailed(false);

    fetch(`/api/translate?tl=${nativeLanguage ?? "ko"}&q=${encodeURIComponent(word)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("request failed"))))
      .then((data: { text?: string }) => {
        if (cancelled) return;
        if (!data.text) throw new Error("empty translation");
        setMeaning(data.text);
      })
      .catch(() => {
        if (!cancelled) setMeaningFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMeaning(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, retryCount]);

  const handleSave = () => {
    addWord(word, meaning ?? word);
    setStatus(getStatus(word) ?? "unfamiliar");
  };

  const displayWord = curated?.word ?? word;
  const isSaved = status !== null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50 shrink-0">
          <h3 className="text-sm font-bold text-gray-700">Dictionary Lookup</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-gray-200 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h2 className="text-2xl font-bold text-teal-600 mb-2">{displayWord}</h2>

          <div className="space-y-1.5 mb-4">
            {(["UK", "US"] as const).map((accent) => (
              <button
                key={accent}
                type="button"
                onClick={() => speak(displayWord, accent)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                <span className="text-gray-400">[{accent}]</span>
                {curated ? (
                  <span className="font-mono">{accent === "UK" ? curated.phonetic.uk : curated.phonetic.us}</span>
                ) : (
                  <span className="text-gray-400 italic">Listen</span>
                )}
                <Volume2 className="w-4 h-4 text-teal-600" />
              </button>
            ))}
          </div>

          {curated ? (
            <>
              <div className="border-t pt-3 mb-3">
                <p className="text-xs text-gray-400 mb-2">Definitions</p>
                <div className="space-y-3">
                  {curated.definitions.map((def, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="text-gray-400 mr-1.5">[{def.pos}]</span>
                        {def.text}
                      </p>
                      {nativeLanguage && def.translation?.[nativeLanguage] && (
                        <p className="text-xs text-gray-400 leading-relaxed mt-1 pl-[1.6em]">
                          {def.translation[nativeLanguage]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2">Examples</p>
                <div className="space-y-3">
                  {curated.examples.map((example, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 leading-relaxed">{example.text}</p>
                      {nativeLanguage && example.translation?.[nativeLanguage] && (
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">
                          {example.translation[nativeLanguage]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-400 mb-2">Meaning</p>
              {isLoadingMeaning && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Translating...
                </div>
              )}
              {meaningFailed && !isLoadingMeaning && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50">
                  <span className="text-xs text-red-600">Meaning unavailable right now.</span>
                  <button
                    type="button"
                    onClick={() => setRetryCount((n) => n + 1)}
                    className="text-xs font-medium text-red-700 underline shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}
              {meaning && !isLoadingMeaning && (
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{meaning}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors",
              isSaved
                ? "bg-teal-50 text-teal-600 cursor-default"
                : "bg-teal-500 text-white hover:bg-teal-600"
            )}
          >
            <Star className={cn("w-4 h-4", isSaved && "fill-teal-500")} />
            {isSaved ? "Saved to Your Vocab List" : "Save to Vocab List"}
          </button>
        </div>
      </div>
    </div>
  );
}
