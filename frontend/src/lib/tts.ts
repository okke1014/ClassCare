export type Accent = "UK" | "US";

let ttsAudio: HTMLAudioElement | null = null;

export const speak = (text: string, accent: Accent = "US") => {
  const cleanText = text.replace(/[.,!?;:'"]/g, "").toLowerCase();
  const ttsLang = accent === "UK" ? "en-gb" : "en-us";

  if (!ttsAudio) {
    ttsAudio = document.createElement("audio");
  }
  ttsAudio.src = `/api/tts?tl=${ttsLang}&q=${encodeURIComponent(cleanText)}`;
  ttsAudio.play().catch(() => {
    // Google TTS proxy can fail offline, so fall back to the browser voice.
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = accent === "UK" ? "en-GB" : "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  });
};
