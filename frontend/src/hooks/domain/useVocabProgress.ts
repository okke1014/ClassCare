"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  VOCAB_WORDS,
  findVocabWordByText,
  type VocabWord,
  type VocabDefinition,
  type VocabExample,
} from "@/lib/vocabData";

export type VocabStatus = "unfamiliar" | "familiar";

export interface VocabWordWithProgress extends VocabWord {
  status: VocabStatus;
  revised: boolean;
}

interface ProgressEntry {
  status: VocabStatus;
  revised: boolean;
}

type ProgressMap = Record<string, ProgressEntry>;

const PROGRESS_STORAGE_KEY = "vocabProgress";
const CUSTOM_WORDS_STORAGE_KEY = "customVocabWords";

const buildDefaults = (): ProgressMap =>
  Object.fromEntries(VOCAB_WORDS.map((w) => [w.id, { status: "unfamiliar" as VocabStatus, revised: false }]));

const saveProgress = (progress: ProgressMap) => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be unavailable (private mode); progress stays in memory only.
  }
};

const loadCustomWords = (): VocabWord[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_WORDS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as VocabWord[]) : [];
  } catch {
    return [];
  }
};

const saveCustomWords = (words: VocabWord[]) => {
  try {
    localStorage.setItem(CUSTOM_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch {
    // Ignore storage failures; words stay in memory for this session only.
  }
};

/** Optional richer dictionary data captured alongside a quick lookup (phonetics/definitions/examples). */
export interface CustomVocabDetails {
  phonetic?: { uk: string; us: string };
  definitions?: VocabDefinition[];
  examples?: VocabExample[];
}

/** Words saved on the fly from lesson scripts (e.g. via the audio player's dictionary popup). */
export const buildCustomVocabWord = (
  word: string,
  meaning: string,
  details?: CustomVocabDetails
): VocabWord => ({
  id: `custom-${word.trim().toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  word: word.trim(),
  phonetic: details?.phonetic ?? { uk: "", us: "" },
  meaning,
  definitions: details?.definitions ?? [],
  examples: details?.examples ?? [],
  addedAt: new Date().toISOString().slice(0, 10),
});

export const useVocabProgress = () => {
  const [progress, setProgress] = useState<ProgressMap>(buildDefaults);
  const [customWords, setCustomWords] = useState<VocabWord[]>([]);

  // Hydrate after mount so the server and first client render stay identical.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        setProgress({ ...buildDefaults(), ...(JSON.parse(stored) as ProgressMap) });
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    }
    setCustomWords(loadCustomWords());
  }, []);

  const setStatus = useCallback((id: string, status: VocabStatus) => {
    setProgress((current) => {
      const next = { ...current, [id]: { status, revised: true } };
      saveProgress(next);
      return next;
    });
  }, []);

  const markFamiliar = useCallback((id: string) => setStatus(id, "familiar"), [setStatus]);
  const markUnfamiliar = useCallback((id: string) => setStatus(id, "unfamiliar"), [setStatus]);

  const resetProgress = useCallback(() => {
    const defaults = buildDefaults();
    saveProgress(defaults);
    setProgress(defaults);
  }, []);

  const allWords = useMemo(() => [...VOCAB_WORDS, ...customWords], [customWords]);

  /**
   * Saves a word to the Unfamiliar list. If the word already matches a curated
   * entry (or was saved before), its existing status is left untouched.
   */
  const addWord = useCallback(
    (word: string, meaning: string, details?: CustomVocabDetails): { id: string; alreadySaved: boolean } => {
      const curated = findVocabWordByText(word);
      if (curated) {
        return { id: curated.id, alreadySaved: !!progress[curated.id] };
      }

      const custom = buildCustomVocabWord(word, meaning, details);
      const existing = customWords.find((w) => w.id === custom.id);
      if (existing) {
        return { id: existing.id, alreadySaved: true };
      }

      const nextCustomWords = [custom, ...customWords];
      setCustomWords(nextCustomWords);
      saveCustomWords(nextCustomWords);

      setProgress((current) => {
        const next = { ...current, [custom.id]: { status: "unfamiliar" as VocabStatus, revised: false } };
        saveProgress(next);
        return next;
      });

      return { id: custom.id, alreadySaved: false };
    },
    [customWords, progress]
  );

  const getStatus = useCallback(
    (word: string): VocabStatus | null => {
      const curated = findVocabWordByText(word);
      const id = curated?.id ?? buildCustomVocabWord(word, "").id;
      return progress[id]?.status ?? (allWords.some((w) => w.id === id) ? "unfamiliar" : null);
    },
    [progress, allWords]
  );

  const words = useMemo<VocabWordWithProgress[]>(
    () =>
      [...allWords]
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
        .map((word) => ({
          ...word,
          status: progress[word.id]?.status ?? "unfamiliar",
          revised: progress[word.id]?.revised ?? false,
        })),
    [allWords, progress]
  );

  const unfamiliarWords = useMemo(() => words.filter((w) => w.status === "unfamiliar"), [words]);
  const familiarWords = useMemo(() => words.filter((w) => w.status === "familiar"), [words]);

  return {
    words,
    unfamiliarWords,
    familiarWords,
    familiarCount: familiarWords.length,
    totalCount: words.length,
    markFamiliar,
    markUnfamiliar,
    resetProgress,
    addWord,
    getStatus,
  };
};
