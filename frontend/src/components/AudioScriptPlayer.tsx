"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/ui/useAudioPlayer";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, X, ChevronRight, Languages, Loader2 } from "lucide-react";
import type { STTSegment, STTWord, SkillScore, SkillUpRecommendation } from "@/lib/sttData";
import { getTranslation, type NativeLanguage } from "@/lib/analysisTranslations";
import { WordDictionaryPopup } from "@/components/vocab/WordDictionaryPopup";

export interface ClassInfo {
  title: string;
  classroom: string;
  teacher: string;
  time: string;
}

interface AudioScriptPlayerProps {
  audioUrl: string;
  transcript: STTSegment[];
  classInfo?: ClassInfo;
  overallScore?: number;
  learningReport?: Record<string, SkillScore>;
  recommendations?: SkillUpRecommendation[];
  nativeLanguage?: NativeLanguage;
  studentName?: string;
}

export function AudioScriptPlayer({
  audioUrl,
  transcript,
  classInfo,
  overallScore,
  learningReport,
  recommendations,
  nativeLanguage,
  studentName,
}: AudioScriptPlayerProps) {
  const { audioRef, state, togglePlay, pause, play, seek, setPlaybackRate } = useAudioPlayer();
  const wasPlayingRef = useRef(false);
  const wordPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const [selectedWord, setSelectedWord] = useState<STTWord | null>(null);
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [activeTab, setActiveTab] = useState<"script" | "report">("script");
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  const [dictionaryWord, setDictionaryWord] = useState<string | null>(null);
  const [segmentTranslation, setSegmentTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationFailed, setTranslationFailed] = useState(false);
  const [translationAttempt, setTranslationAttempt] = useState(0);
  const translationCacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  const currentTimeMs = state.currentTime * 1000;

  const activeLocation = useMemo(() => {
    for (let si = 0; si < transcript.length; si++) {
      const seg = transcript[si];
      for (let wi = 0; wi < seg.words.length; wi++) {
        const w = seg.words[wi];
        if (currentTimeMs >= w.start && currentTimeMs < w.end) {
          return { segIndex: si, wordIndex: wi };
        }
      }
    }
    return null;
  }, [currentTimeMs, transcript]);

  useEffect(() => {
    if (activeLocation && activeWordRef.current && containerRef.current && state.isPlaying) {
      const container = containerRef.current;
      const element = activeWordRef.current;
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop - container.offsetTop;
      const elementHeight = element.clientHeight;
      container.scrollTo({
        top: elementTop - containerHeight / 2 + elementHeight / 2,
        behavior: "smooth",
      });
    }
  }, [activeLocation, state.isPlaying]);

  useEffect(() => {
    if (selectedSegmentIndex === null) return;
    const segment = transcript[selectedSegmentIndex];
    if (!segment) return;

    const text = segment.words.map((w) => w.text).join(" ");
    const language = nativeLanguage ?? "ko";
    const cacheKey = `${language}:${text}`;
    const cached = translationCacheRef.current.get(cacheKey);

    if (cached) {
      setSegmentTranslation(cached);
      setTranslationFailed(false);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setSegmentTranslation(null);
    setTranslationFailed(false);
    setIsTranslating(true);

    fetch(`/api/translate?tl=${language}&q=${encodeURIComponent(text)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("request failed"))))
      .then((data: { text?: string }) => {
        if (cancelled) return;
        if (!data.text) throw new Error("empty translation");
        translationCacheRef.current.set(cacheKey, data.text);
        setSegmentTranslation(data.text);
      })
      .catch(() => {
        if (!cancelled) setTranslationFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSegmentIndex, transcript, nativeLanguage, translationAttempt]);

  const handleWordClick = (word: STTWord, element: HTMLElement) => {
    wasPlayingRef.current = state.isPlaying;
    if (word.status !== "normal" && state.isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = word.start / 1000;
      }
    } else {
      seek(word.start / 1000);
    }
    setSelectedWord(word);

    if (word.status !== "normal" && containerRef.current) {
      const container = containerRef.current;
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop - container.offsetTop;
      const elementHeight = element.clientHeight;
      requestAnimationFrame(() => {
        container.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: "smooth",
        });
      });
    }
  };

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  const speakWord = (text: string, locale: "en-GB" | "en-US") => {
    const cleanText = text.replace(/[.,!?;:'"]/g, "").toLowerCase();
    const ttsLang = locale === "en-GB" ? "en-gb" : "en-us";
    const url = `/api/tts?tl=${ttsLang}&q=${encodeURIComponent(cleanText)}`;

    if (!ttsAudioRef.current) {
      ttsAudioRef.current = document.createElement("audio");
    }
    const el = ttsAudioRef.current;
    el.src = url;
    el.play().catch(() => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = locale;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleCloseWordPopup = () => {
    if (wordPlayTimerRef.current) {
      clearTimeout(wordPlayTimerRef.current);
      wordPlayTimerRef.current = null;
    }
    setIsPlayingWord(false);
    setSelectedWord(null);
    if (wasPlayingRef.current) {
      const audio = audioRef.current;
      if (audio) {
        audio.play();
      }
    }
  };

  const playWordSegment = (word: STTWord) => {
    if (wordPlayTimerRef.current) {
      clearTimeout(wordPlayTimerRef.current);
    }
    const audio = audioRef.current;
    if (!audio) return;

    const padBefore = 150;
    const padAfter = 500;
    const startSec = Math.max(0, (word.start - padBefore)) / 1000;
    const durationMs = (word.end - word.start) + padBefore + padAfter;

    audio.currentTime = startSec;
    audio.play();
    setIsPlayingWord(true);

    wordPlayTimerRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = startSec;
      setIsPlayingWord(false);
      wordPlayTimerRef.current = null;
    }, durationMs);
  };

  const getWordStyle = (word: STTWord, isTeacher: boolean) => {
    if (isTeacher) return "text-gray-700";
    if (word.status === "severe") return "text-red-600 underline decoration-red-400 decoration-wavy underline-offset-4";
    if (word.status === "slight") return "text-amber-600";
    return "text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getLevelColor = (level: string) => {
    if (level === "Proficient") return "text-green-700 bg-green-100";
    if (level === "Intermediate") return "text-blue-700 bg-blue-100";
    if (level === "Developing") return "text-amber-700 bg-amber-100";
    return "text-gray-700 bg-gray-100";
  };

  const feedbackTranslation = getTranslation(selectedWord?.feedback, nativeLanguage);

  const handleSegmentClick = (segmentIndex: number, startMs?: number) => {
    const start = startMs ?? transcript[segmentIndex]?.words[0]?.start;
    if (typeof start === "number") {
      seek(start / 1000);
    }
    pause();
    setSelectedWord(null);
    setSelectedSegmentIndex(segmentIndex);
  };

  const handleCloseSegmentPopup = () => {
    setSelectedSegmentIndex(null);
    setSegmentTranslation(null);
    setIsTranslating(false);
    setTranslationFailed(false);
    play();
  };

  const handleStudentSentenceClick = (segment: STTSegment) => {
    const start = segment.words[0]?.start;
    if (typeof start === "number") {
      seek(start / 1000);
    }
    setSelectedWord(null);
    play();
  };

  const getInitial = (name?: string, fallback: string = "?") =>
    name?.trim() ? name.trim()[0].toUpperCase() : fallback;
  const teacherInitial = getInitial(classInfo?.teacher, "T");
  const studentInitial = getInitial(studentName, "S");

  return (
    <div className="flex flex-col h-full bg-white text-foreground overflow-hidden relative">
      <audio ref={audioRef} src={audioUrl} />

      {/* Tab Bar */}
      <div className="flex border-b bg-white shrink-0">
        <button
          onClick={() => setActiveTab("script")}
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors",
            activeTab === "script"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Script
        </button>
        {(learningReport || recommendations) && (
          <button
            onClick={() => setActiveTab("report")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors",
              activeTab === "report"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Report
          </button>
        )}
      </div>

      {/* Script Tab */}
      {activeTab === "script" && (
        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
          {/* Class Info */}
          {classInfo && (
            <div className="p-3 bg-gray-50 rounded-xl border text-sm mb-4">
              <div className="font-semibold text-base mb-1.5">{classInfo.title}</div>
              <div className="grid grid-cols-3 gap-1 text-gray-500 text-xs">
                <div>
                  <span className="block text-[11px] text-gray-400 uppercase">Room</span>
                  {classInfo.classroom}
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400 uppercase">Teacher</span>
                  {classInfo.teacher}
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400 uppercase">Time</span>
                  {classInfo.time}
                </div>
              </div>
              {overallScore !== undefined && (
                <div className="mt-2 pt-2 border-t flex items-center gap-2">
                  <span className="text-xs text-gray-400">Overall Score</span>
                  <span className={cn("font-bold text-lg", getScoreColor(overallScore))}>
                    {overallScore}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Conversation Segments */}
          {transcript.map((segment, si) => {
            const isTeacher = segment.speaker === "Teacher";
            return (
              <div key={si} className={cn("flex gap-2", isTeacher ? "justify-start" : "justify-end")}>
                {isTeacher && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 mt-1">
                    {teacherInitial}
                  </div>
                )}
                <div className={cn("max-w-[85%] min-w-0")}>
                  <span className={cn(
                    "text-[11px] font-medium mb-0.5 flex items-center gap-1",
                    isTeacher ? "text-blue-600" : "text-green-600 justify-end"
                  )}>
                    {segment.speaker}
                    {isTeacher && (
                      <span className="text-gray-400 inline-flex items-center gap-0.5">
                        <Languages size={10} />
                        Tap to translate
                      </span>
                    )}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={
                      isTeacher
                        ? "Translate this sentence"
                        : "Play from this sentence"
                    }
                    onClick={isTeacher ? () => handleSegmentClick(si) : () => handleStudentSentenceClick(segment)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (isTeacher) {
                          handleSegmentClick(si);
                        } else {
                          handleStudentSentenceClick(segment);
                        }
                      }
                    }}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm leading-relaxed cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
                      isTeacher
                        ? "bg-gray-100 rounded-tl-sm hover:bg-gray-200"
                        : "bg-blue-50 rounded-tr-sm hover:bg-blue-100"
                    )}
                  >
                    <p className="leading-relaxed">
                      {segment.words.map((word, wi) => {
                        const isActive =
                          activeLocation?.segIndex === si && activeLocation?.wordIndex === wi;
                        const hasIssue = word.status !== "normal";
                        return (
                          <React.Fragment key={wi}>
                            {wi > 0 && " "}
                            <span
                              ref={isActive ? activeWordRef : null}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isTeacher) {
                                  handleSegmentClick(si, word.start);
                                } else {
                                  handleWordClick(word, e.currentTarget);
                                }
                              }}
                              className={cn(
                                "transition-all duration-150 rounded px-0.5 inline cursor-pointer",
                                isActive && "bg-yellow-300 text-black",
                                !isActive && getWordStyle(word, isTeacher),
                                !isActive && (isTeacher ? "hover:bg-gray-300" : "hover:bg-blue-100"),
                                !isActive && hasIssue && !isTeacher && "font-medium"
                              )}
                            >
                              {word.text}
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </p>
                  </div>
                </div>
                {!isTeacher && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold shrink-0 mt-1">
                    {studentInitial}
                  </div>
                )}
              </div>
            );
          })}
          <div className="h-24" />
        </div>
      )}

      {/* Report Tab */}
      {activeTab === "report" && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {learningReport && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <span className="w-1 h-4 bg-blue-600 rounded-full inline-block" />
                Learning Report
              </h3>
              <div className="space-y-2">
                {Object.entries(learningReport).map(([key, val]) => {
                  const summaryTranslation = getTranslation(val.summary, nativeLanguage);
                  return (
                    <div key={key} className={cn("p-3 rounded-xl border", getScoreBg(val.score))}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", getLevelColor(val.level))}>
                            {val.level}
                          </span>
                          <span className={cn("text-lg font-black", getScoreColor(val.score))}>
                            {val.score}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{val.summary}</p>
                      {summaryTranslation && (
                        <p className="text-xs text-gray-500 leading-relaxed mt-1 pt-1 border-t border-gray-200/60">
                          {summaryTranslation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <span className="w-1 h-4 bg-amber-500 rounded-full inline-block" />
                Skill-Up Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, i) => {
                  const reasonTranslation = getTranslation(rec.reason, nativeLanguage);
                  return (
                    <div key={i} className="p-3 bg-white rounded-xl border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded">
                          {rec.category}
                        </span>
                        <span className="text-[11px] text-gray-400">{rec.focus_skill}</span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-red-400 text-xs mt-0.5 shrink-0">Before</span>
                          <p className="text-gray-500 line-through text-xs leading-relaxed">{rec.original}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 text-xs mt-0.5 shrink-0">After</span>
                          <p className="text-gray-800 font-medium text-xs leading-relaxed">{rec.improved}</p>
                        </div>
                        <p className="text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 leading-relaxed">
                          {rec.reason}
                        </p>
                        {reasonTranslation && (
                          <p className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded leading-relaxed">
                            {reasonTranslation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="h-24" />
        </div>
      )}

      {/* Sentence Translation Popup */}
      {selectedSegmentIndex !== null && transcript[selectedSegmentIndex] && (
        <div className="absolute bottom-[140px] left-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-5 z-20 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Languages size={16} className="text-blue-500" />
              Translation
            </h3>
            <button onClick={handleCloseSegmentPopup} aria-label="Close" className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-[45vh] overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              {transcript[selectedSegmentIndex].words.map((w, wi) => (
                <React.Fragment key={wi}>
                  {wi > 0 && " "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setDictionaryWord(w.text.replace(/[.,!?;:'"]/g, ""));
                    }}
                    className="cursor-pointer rounded px-0.5 hover:bg-blue-100 transition-colors"
                  >
                    {w.text}
                  </span>
                </React.Fragment>
              ))}
            </p>
            <p className="text-[11px] text-gray-400 -mt-2 flex items-center gap-1">
              <Languages size={11} />
              Tap a word to look it up
            </p>

            <div className="border-t border-gray-100" />

            {isTranslating && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Translating...
              </div>
            )}

            {translationFailed && !isTranslating && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50">
                <span className="text-xs text-red-600">Translation unavailable.</span>
                <button
                  onClick={() => setTranslationAttempt((n) => n + 1)}
                  className="text-xs font-medium text-red-700 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {segmentTranslation && !isTranslating && (
              <p className="px-3 py-2 rounded-lg bg-blue-50 text-sm text-blue-800 leading-relaxed">
                {segmentTranslation}
              </p>
            )}

            <button
              onClick={handleCloseSegmentPopup}
              className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Word Detail Popup */}
      {selectedWord && selectedWord.status !== "normal" && (
        <div className="absolute bottom-[140px] left-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-5 z-20 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">{selectedWord.text}</h3>
              {selectedWord.score !== undefined && (
                <span className={cn("text-xl font-black", getScoreColor(selectedWord.score))}>
                  {selectedWord.score}
                </span>
              )}
            </div>
            <button onClick={handleCloseWordPopup} aria-label="Close" className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {selectedWord.dictionary_phonetic && (
              <div className="flex divide-x divide-gray-100">
                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">UK</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm text-gray-600">
                      {selectedWord.dictionary_phonetic.uk}
                    </span>
                    <button onClick={() => speakWord(selectedWord.text, "en-GB")} aria-label="Listen in British English" className="text-blue-500 hover:bg-blue-50 p-0.5 rounded-full">
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">US</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm text-gray-600">
                      {selectedWord.dictionary_phonetic.us}
                    </span>
                    <button onClick={() => speakWord(selectedWord.text, "en-US")} aria-label="Listen in American English" className="text-blue-500 hover:bg-blue-50 p-0.5 rounded-full">
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <>
              <div className="border-t border-gray-100" />
              <div className="flex items-center justify-between px-2">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Your Pronunciation</span>
                  <div className="flex items-center gap-2">
                    {selectedWord.user_phonetic ? (
                      <span className={cn("font-mono text-sm", selectedWord.status === "severe" ? "text-red-500" : "text-amber-500")}>
                        {selectedWord.user_phonetic}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Tap to listen</span>
                    )}
                    <button
                      onClick={() => playWordSegment(selectedWord)}
                      aria-label="Play your pronunciation"
                      className={cn(
                        "p-0.5 rounded-full",
                        isPlayingWord
                          ? "text-red-500 animate-pulse"
                          : "text-blue-500 hover:bg-blue-50"
                      )}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </>

            {selectedWord.feedback && (
              <>
                <div className="border-t border-gray-100" />
                <div className={cn(
                  "px-3 py-2 rounded-lg text-xs leading-relaxed",
                  selectedWord.status === "severe" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                )}>
                  {selectedWord.feedback}
                </div>
                {feedbackTranslation && (
                  <div className={cn(
                    "px-3 py-2 rounded-lg text-xs leading-relaxed",
                    selectedWord.status === "severe" ? "bg-red-50/60 text-red-600" : "bg-amber-50/60 text-amber-600"
                  )}>
                    {feedbackTranslation}
                  </div>
                )}
              </>
            )}

            <button
              onClick={handleCloseWordPopup}
              className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Word Dictionary Popup */}
      {dictionaryWord && (
        <WordDictionaryPopup
          word={dictionaryWord}
          nativeLanguage={nativeLanguage}
          onClose={() => setDictionaryWord(null)}
        />
      )}

      {/* Control Bar */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            aria-label={state.isPlaying ? "Pause" : "Play"}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-transform shrink-0"
          >
            {state.isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex-1 flex flex-col justify-center gap-1">
            <input
              type="range"
              min={0}
              max={state.duration || 100}
              value={state.currentTime}
              aria-label="Seek audio position"
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 font-medium px-0.5">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              const rates = [0.8, 1.0, 1.2, 1.5];
              const nextIndex = (rates.indexOf(state.playbackRate) + 1) % rates.length;
              setPlaybackRate(rates[nextIndex]);
            }}
            aria-label={`Playback speed ${state.playbackRate}x, tap to change`}
            className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-2 py-1.5 min-w-[3rem] text-center transition-colors shrink-0"
          >
            {state.playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
