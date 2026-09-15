// Server-only helpers for looking up word meanings.
// Google's unofficial translate endpoint aggressively rate-limits shared/server
// IPs (frequently returns 429), so MyMemory is used as the primary backend and
// Google is kept only as a best-effort fallback.

const fetchWithTimeout = async (url: string, ms: number, init?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const translateViaMyMemory = async (text: string, tl: string): Promise<string | null> => {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(tl)}`;
    const res = await fetchWithTimeout(url, 6000);
    if (!res.ok) return null;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (typeof translated !== "string" || !translated || translated.toUpperCase().includes("MYMEMORY WARNING")) {
      return null;
    }
    return translated;
  } catch {
    return null;
  }
};

const translateViaGoogle = async (text: string, tl: string): Promise<string | null> => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetchWithTimeout(url, 5000, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://translate.google.com/",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const chunks: unknown[] = Array.isArray(data?.[0]) ? data[0] : [];
    const joined = chunks
      .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
      .join("")
      .trim();
    return joined || null;
  } catch {
    return null;
  }
};

/** Translates English text to the target language, trying MyMemory first, then Google as a fallback. */
export const translateText = async (text: string, tl: string): Promise<string | null> => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return (await translateViaMyMemory(trimmed, tl)) ?? (await translateViaGoogle(trimmed, tl));
};

export { fetchWithTimeout };
