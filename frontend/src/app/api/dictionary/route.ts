import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, translateText } from "@/lib/serverTranslate";

interface RawDefinition {
  pos: string;
  text: string;
}

interface DictionaryApiEntry {
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings?: {
    partOfSpeech?: string;
    definitions?: { definition?: string; example?: string }[];
  }[];
}

const POS_ABBREVIATIONS: Record<string, string> = {
  noun: "n",
  verb: "v",
  adjective: "adj",
  adverb: "adv",
  pronoun: "pron",
  preposition: "prep",
  conjunction: "conj",
  interjection: "interj",
};

const abbreviatePos = (pos?: string) => {
  if (!pos) return "";
  return POS_ABBREVIATIONS[pos.toLowerCase()] ?? pos.slice(0, 4);
};

/** Fetches the English entry (phonetics + definitions + examples) from the free dictionary API. */
const fetchDictionaryEntry = async (word: string): Promise<DictionaryApiEntry | null> => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  // The upstream occasionally stalls or is entirely unreachable, so retry once before giving up.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(url, 4000);
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? (data[0] as DictionaryApiEntry) ?? null : null;
    } catch {
      if (attempt === 1) return null;
    }
  }
  return null;
};

// ARPAbet (used by Datamuse's "r" pronunciation tag) -> a lightweight IPA-like
// transcription, matching the informal style already used for curated words
// (e.g. "kən'si:v"). This is only used when the primary dictionary has no
// phonetic transcription at all.
const ARPABET_TO_PHONETIC: Record<string, string> = {
  AA: "ɑ", AE: "æ", AH: "ʌ", AO: "ɔ:", AW: "aʊ", AY: "aɪ",
  EH: "e", ER: "ɜr", EY: "eɪ", IH: "ɪ", IY: "i:", OW: "oʊ",
  OY: "ɔɪ", UH: "ʊ", UW: "u:",
  B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "g", HH: "h",
  JH: "dʒ", K: "k", L: "l", M: "m", N: "n", NG: "ŋ", P: "p",
  R: "r", S: "s", SH: "ʃ", T: "t", TH: "θ", V: "v", W: "w",
  Y: "j", Z: "z", ZH: "ʒ",
};

const arpabetToPhonetic = (arpabet: string): string =>
  arpabet
    .trim()
    .split(/\s+/)
    .map((token) => {
      const match = token.match(/^([A-Z]+)([0-2])?$/);
      if (!match) return "";
      const [, base, stress] = match;
      const sound = ARPABET_TO_PHONETIC[base] ?? base.toLowerCase();
      return stress === "1" ? `'${sound}` : sound;
    })
    .join("");

/** Best-effort phonetic transcription from Datamuse, used only when the primary dictionary has none. */
const fetchPhoneticFallback = async (word: string): Promise<string | null> => {
  try {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=r&max=1`;
    const res = await fetchWithTimeout(url, 3000);
    if (!res.ok) return null;
    const data = await res.json();
    const tags: string[] = data?.[0]?.tags ?? [];
    const pronTag = tags.find((t) => t.startsWith("pron:"));
    if (!pronTag) return null;
    const phonetic = arpabetToPhonetic(pronTag.replace("pron:", ""));
    return phonetic || null;
  } catch {
    return null;
  }
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

interface WiktionaryEntry {
  partOfSpeech?: string;
  definitions?: { definition?: string; examples?: string[] }[];
}

/** Fallback definitions/examples source (Wikimedia), used when the primary dictionary has no entry. */
const fetchWiktionaryDefinitions = async (
  word: string
): Promise<{ definitions: RawDefinition[]; examples: string[] } | null> => {
  try {
    const url = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const res = await fetchWithTimeout(url, 4000);
    if (!res.ok) return null;
    const data: Record<string, WiktionaryEntry[]> = await res.json();
    const entries = data.en ?? [];
    if (entries.length === 0) return null;

    const definitions: RawDefinition[] = [];
    const examples: string[] = [];
    for (const entry of entries) {
      const pos = abbreviatePos(entry.partOfSpeech);
      for (const def of entry.definitions ?? []) {
        const text = def.definition ? stripHtml(def.definition) : "";
        if (text && definitions.length < 3) {
          definitions.push({ pos, text });
        }
        for (const ex of def.examples ?? []) {
          const exText = stripHtml(ex);
          if (exText && examples.length < 2) examples.push(exText);
        }
      }
    }
    return definitions.length > 0 ? { definitions, examples } : null;
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const word = (searchParams.get("q") || "").trim();
  const tl = searchParams.get("tl") || "ko";

  if (!word) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const normalizedWord = word.toLowerCase();
  const entry = await fetchDictionaryEntry(normalizedWord);

  const generalPhonetic = entry?.phonetic ?? "";
  const phonetic = { uk: "", us: "" };
  for (const p of entry?.phonetics ?? []) {
    if (!p.text) continue;
    const audio = (p.audio ?? "").toLowerCase();
    if (audio.includes("-uk") && !phonetic.uk) phonetic.uk = p.text;
    else if (audio.includes("-us") && !phonetic.us) phonetic.us = p.text;
  }
  if (!phonetic.uk) phonetic.uk = generalPhonetic;
  if (!phonetic.us) phonetic.us = generalPhonetic;

  // Primary dictionary had no phonetic transcription at all (unknown word or upstream down) - try a fallback source.
  if (!phonetic.uk && !phonetic.us) {
    const fallbackPhonetic = await fetchPhoneticFallback(normalizedWord);
    if (fallbackPhonetic) {
      phonetic.uk = fallbackPhonetic;
      phonetic.us = fallbackPhonetic;
    }
  }

  const rawDefinitions: RawDefinition[] = [];
  const rawExamples: string[] = [];

  for (const meaning of entry?.meanings ?? []) {
    const pos = abbreviatePos(meaning.partOfSpeech);
    for (const def of meaning.definitions ?? []) {
      if (def.definition && rawDefinitions.length < 3) {
        rawDefinitions.push({ pos, text: def.definition });
      }
      if (def.example && rawExamples.length < 2) {
        rawExamples.push(def.example);
      }
    }
  }

  // Primary dictionary had no usable definitions (unknown word or upstream down) - try Wiktionary next.
  if (rawDefinitions.length === 0) {
    const wiktionary = await fetchWiktionaryDefinitions(normalizedWord);
    if (wiktionary) {
      rawDefinitions.push(...wiktionary.definitions);
      rawExamples.push(...wiktionary.examples);
    }
  }

  if (rawDefinitions.length === 0) {
    // Both dictionary sources failed - fall back to a plain translation as a last resort.
    const meaning = await translateText(word, tl);
    if (!meaning) {
      return NextResponse.json({ error: "Dictionary lookup failed" }, { status: 502 });
    }
    return NextResponse.json({ phonetic, definitions: [], examples: [], meaning });
  }

  const [definitionTranslations, exampleTranslations] = await Promise.all([
    Promise.all(rawDefinitions.map((d) => translateText(d.text, tl))),
    Promise.all(rawExamples.map((e) => translateText(e, tl))),
  ]);

  const definitions = rawDefinitions.map((d, i) => ({
    pos: d.pos,
    text: d.text,
    translation: definitionTranslations[i] ? { [tl]: definitionTranslations[i] as string } : {},
  }));

  const examples = rawExamples.map((text, i) => ({
    text,
    translation: exampleTranslations[i] ? { [tl]: exampleTranslations[i] as string } : {},
  }));

  return NextResponse.json(
    { phonetic, definitions, examples },
    { headers: { "Cache-Control": "public, max-age=86400" } }
  );
}
