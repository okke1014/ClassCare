"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Volume2, X } from "lucide-react";
import { findVocabWordByText, type VocabDefinition, type VocabExample } from "@/lib/vocabData";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { useVocabProgress, type VocabStatus } from "@/hooks/domain/useVocabProgress";

interface WordDictionaryPopupProps {
  word: string;
  nativeLanguage?: NativeLanguage;
  onClose: () => void;
}

interface DictionaryLookup {
  phonetic: { uk: string; us: string };
  definitions: VocabDefinition[];
  examples: VocabExample[];
  meaning?: string;
}

export function WordDictionaryPopup({ word, nativeLanguage, onClose }: WordDictionaryPopupProps) {
  const { addWord, getStatus } = useVocabProgress();
  const curated = findVocabWordByText(word);

  const [lookup, setLookup] = useState<DictionaryLookup | null>(null);
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(!curated);
  const [meaningFailed, setMeaningFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [status, setStatus] = useState<VocabStatus | null>(() => getStatus(word));

  useEffect(() => {
    if (curated) return;
    let cancelled = false;
    setIsLoadingMeaning(true);
    setMeaningFailed(false);
    setLookup(null);

    fetch(`/api/dictionary?tl=${nativeLanguage ?? "ko"}&q=${encodeURIComponent(word)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("request failed"))))
      .then((data: DictionaryLookup & { error?: string }) => {
        if (cancelled) return;
        if (data.error || (data.definitions.length === 0 && !data.meaning)) {
          throw new Error("no lookup data");
        }
        setLookup(data);
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
    const fallbackMeaning = lookup?.definitions[0]?.text ?? lookup?.meaning ?? word;
    addWord(word, fallbackMeaning, lookup
      ? {
          phonetic: { uk: lookup.phonetic?.uk ?? "", us: lookup.phonetic?.us ?? "" },
          definitions: lookup.definitions ?? [],
          examples: lookup.examples ?? [],
        }
      : undefined);
    setStatus("unfamiliar");
  };

  // Once already saved, silently upgrade the stored entry if a still-loading
  // dictionary lookup finishes afterwards with richer data than what was saved.
  useEffect(() => {
    if (status !== null && lookup && lookup.definitions.length > 0) {
      handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookup]);

  const displayWord = curated?.word ?? word;
  const isSaved = status !== null;
  const hasRichLookup = !curated && !!lookup && lookup.definitions.length > 0;
  const canSave = !isLoadingMeaning || !!curated;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85dvh] overflow-hidden flex flex-col"
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
                {(() => {
                  const phonetic = curated?.phonetic ?? lookup?.phonetic;
                  const text = accent === "UK" ? phonetic?.uk : phonetic?.us;
                  return text ? (
                    <span className="font-mono">{text}</span>
                  ) : (
                    <span className="text-gray-400 italic">Listen</span>
                  );
                })()}
                <Volume2 className="w-4 h-4 text-teal-600" />
              </button>
            ))}
          </div>

          {isLoadingMeaning && !curated && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Looking up...
              </div>
            </div>
          )}

          {curated || hasRichLookup ? (
            <>
              <div className="border-t pt-3 mb-3">
                <p className="text-xs text-gray-400 mb-2">Definitions</p>
                <div className="space-y-3">
                  {(curated?.definitions ?? lookup!.definitions).map((def, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {def.pos && <span className="text-gray-400 mr-1.5">[{def.pos}]</span>}
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
              {(curated?.examples ?? lookup!.examples).length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400 mb-2">Examples</p>
                  <div className="space-y-3">
                    {(curated?.examples ?? lookup!.examples).map((example, i) => (
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
              )}
            </>
          ) : (
            !isLoadingMeaning && (
              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2">Definitions</p>
                {meaningFailed && (
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
                {lookup?.meaning && !meaningFailed && (
                  <p className="text-sm text-gray-700 leading-relaxed">{lookup.meaning}</p>
                )}
              </div>
            )
          )}
        </div>

        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved || !canSave}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors",
              isSaved
                ? "bg-teal-50 text-teal-600 cursor-default"
                : "bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            <Star className={cn("w-4 h-4", isSaved && "fill-teal-500")} />
            {isSaved ? "Saved to Your Vocab List" : canSave ? "Save to Vocab List" : "Looking up..."}
          </button>
        </div>
      </div>
    </div>
  );
}
