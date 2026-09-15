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
  // The upstream occasionally stalls on an otherwise-healthy connection, so retry once.
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const word = (searchParams.get("q") || "").trim();
  const tl = searchParams.get("tl") || "ko";

  if (!word) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const entry = await fetchDictionaryEntry(word.toLowerCase());

  if (!entry) {
    // Dictionary lookup failed (unknown word or upstream hiccup) - fall back to a plain translation.
    const meaning = await translateText(word, tl);
    if (!meaning) {
      return NextResponse.json({ error: "Dictionary lookup failed" }, { status: 502 });
    }
    return NextResponse.json({ phonetic: { uk: "", us: "" }, definitions: [], examples: [], meaning });
  }

  const generalPhonetic = entry.phonetic ?? "";
  const phonetic = { uk: "", us: "" };
  for (const p of entry.phonetics ?? []) {
    if (!p.text) continue;
    const audio = (p.audio ?? "").toLowerCase();
    if (audio.includes("-uk") && !phonetic.uk) phonetic.uk = p.text;
    else if (audio.includes("-us") && !phonetic.us) phonetic.us = p.text;
  }
  if (!phonetic.uk) phonetic.uk = generalPhonetic;
  if (!phonetic.us) phonetic.us = generalPhonetic;

  const rawDefinitions: RawDefinition[] = [];
  const rawExamples: string[] = [];

  for (const meaning of entry.meanings ?? []) {
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

  if (rawDefinitions.length === 0) {
    const meaning = await translateText(word, tl);
    return NextResponse.json({ phonetic, definitions: [], examples: [], meaning: meaning ?? undefined });
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
