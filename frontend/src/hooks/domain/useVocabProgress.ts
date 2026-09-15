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

const normalizeCustomWord = (word: VocabWord): VocabWord => ({
  ...word,
  phonetic: word.phonetic ?? { uk: "", us: "" },
  definitions: word.definitions ?? [],
  examples: word.examples ?? [],
});

const loadCustomWords = (): VocabWord[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_WORDS_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as VocabWord[]) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeCustomWord) : [];
  } catch {
    return [];
  }
};

const hasPhonetic = (word: Pick<VocabWord, "phonetic">) => !!(word.phonetic?.uk || word.phonetic?.us);

/** Picks the richer of two copies of the same custom word so a later lookup can fill in missing dictionary data. */
const mergeCustomWord = (existing: VocabWord, incoming: VocabWord): VocabWord => {
  const existingDefs = existing.definitions ?? [];
  const incomingDefs = incoming.definitions ?? [];
  const existingExs = existing.examples ?? [];
  const incomingExs = incoming.examples ?? [];
  const richerMeaning =
    incoming.meaning && incoming.meaning !== incoming.word && incoming.meaning.length > (existing.meaning?.length ?? 0)
      ? incoming.meaning
      : existing.meaning || incoming.meaning;

  return {
    ...existing,
    meaning: richerMeaning,
    phonetic: hasPhonetic(incoming) ? incoming.phonetic : existing.phonetic ?? { uk: "", us: "" },
    definitions: incomingDefs.length > existingDefs.length ? incomingDefs : existingDefs,
    examples: incomingExs.length > existingExs.length ? incomingExs : existingExs,
  };
};

const isRicherThan = (incoming: VocabWord, existing: VocabWord) => {
  const merged = mergeCustomWord(existing, incoming);
  return (
    merged.definitions.length > (existing.definitions?.length ?? 0) ||
    merged.examples.length > (existing.examples?.length ?? 0) ||
    (hasPhonetic(merged) && !hasPhonetic(existing)) ||
    merged.meaning !== existing.meaning
  );
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
  // Merge with any in-memory saves that raced ahead of this effect.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        setProgress((current) => ({ ...buildDefaults(), ...(JSON.parse(stored) as ProgressMap), ...current }));
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    }
    const storedWords = loadCustomWords();
    setCustomWords((current) => {
      const byId = new Map<string, VocabWord>();
      for (const word of storedWords) byId.set(word.id, word);
      for (const word of current) {
        const existing = byId.get(word.id);
        byId.set(word.id, existing ? mergeCustomWord(existing, word) : word);
      }
      const merged = Array.from(byId.values());
      saveCustomWords(merged);
      return merged;
    });
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
   * entry (or was saved before), its existing status is left untouched. If a
   * previously-saved custom word lacked rich details (e.g. it was saved before
   * the dictionary lookup finished) and richer details are now available, the
   * stored entry is upgraded in place.
   */
  const addWord = useCallback(
    (word: string, meaning: string, details?: CustomVocabDetails): { id: string; alreadySaved: boolean } => {
      const curated = findVocabWordByText(word);
      if (curated) {
        return { id: curated.id, alreadySaved: true };
      }

      const custom = buildCustomVocabWord(word, meaning, details);
      let alreadySaved = false;

      setCustomWords((current) => {
        const existing = current.find((w) => w.id === custom.id);
        if (existing) {
          alreadySaved = true;
          if (!isRicherThan(custom, existing)) return current;
          const next = current.map((w) => (w.id === custom.id ? mergeCustomWord(existing, custom) : w));
          saveCustomWords(next);
          return next;
        }
        const next = [custom, ...current];
        saveCustomWords(next);
        return next;
      });

      setProgress((current) => {
        if (current[custom.id]) return current;
        const next = { ...current, [custom.id]: { status: "unfamiliar" as VocabStatus, revised: false } };
        saveProgress(next);
        return next;
      });

      return { id: custom.id, alreadySaved };
    },
    []
  );

  /** Fills in dictionary details for a previously saved custom word that only has a short meaning. */
  const enrichWord = useCallback(async (rawWord: string, tl: string) => {
    const curated = findVocabWordByText(rawWord);
    if (curated) return;

    const id = buildCustomVocabWord(rawWord, "").id;
    const res = await fetch(`/api/dictionary?tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(rawWord.trim())}`);
    if (!res.ok) return;
    const data = (await res.json()) as CustomVocabDetails & { meaning?: string; error?: string };
    if (data.error || (!(data.definitions?.length) && !data.meaning)) return;

    const incoming = buildCustomVocabWord(rawWord, data.definitions?.[0]?.text ?? data.meaning ?? rawWord, {
      phonetic: data.phonetic,
      definitions: data.definitions ?? [],
      examples: data.examples ?? [],
    });

    setCustomWords((current) => {
      const existing = current.find((w) => w.id === id);
      if (!existing) return current;
      if (!isRicherThan(incoming, existing)) return current;
      const next = current.map((w) => (w.id === id ? mergeCustomWord(existing, incoming) : w));
      saveCustomWords(next);
      return next;
    });
  }, []);

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
    enrichWord,
    getStatus,
  };
};
