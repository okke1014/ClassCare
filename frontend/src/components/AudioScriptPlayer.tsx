"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/ui/useAudioPlayer";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, X, Mic, Volume2 } from "lucide-react";
import { WordPracticeDialog } from "./WordPracticeDialog";

export interface Word {
  word: string;
  start_time: number;
  end_time: number;
  score?: number;
  phonemes?: string; 
  phonemes_uk?: string;
  phonemes_us?: string;
  user_phonemes?: string;
}

export interface ClassInfo {
    title: string;
    classroom: string;
    teacher: string;
    time: string;
}

interface AudioScriptPlayerProps {
  audioUrl: string;
  script: Word[];
  classInfo?: ClassInfo;
}

export function AudioScriptPlayer({ audioUrl, script, classInfo }: AudioScriptPlayerProps) {
  const { audioRef, state, togglePlay, seek, setPlaybackRate } = useAudioPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showPractice, setShowPractice] = useState(false);

  // Find active word index
  const activeWordIndex = useMemo(() => {
    return script.findIndex(
      (w) => state.currentTime >= w.start_time && state.currentTime < w.end_time
    );
  }, [state.currentTime, script]);

  // Auto-scroll to active word
  useEffect(() => {
    if (activeWordIndex !== -1 && activeWordRef.current && containerRef.current) {
        // Only scroll if we are playing to avoid jumping while user reads
        if (state.isPlaying) {
            const container = containerRef.current;
            const element = activeWordRef.current;
            
            const containerHeight = container.clientHeight;
            const elementTop = element.offsetTop - container.offsetTop;
            const elementHeight = element.clientHeight;
            
            // Scroll to center
            container.scrollTo({
                top: elementTop - containerHeight / 2 + elementHeight / 2,
                behavior: "smooth"
            });
        }
    }
  }, [activeWordIndex, state.isPlaying]);

  const handleWordClick = (word: Word) => {
      // If a word is already selected, just switch the selection without closing/reopening animation if possible
      // or just set the new word directly. React will re-render.
      seek(word.start_time);
      setSelectedWord(word);
      setShowPractice(false); // Reset practice mode when switching words
  };

  const getScoreColor = (score?: number) => {
      if (score === undefined) return "text-gray-400";
      if (score >= 80) return "text-green-600";
      if (score >= 50) return "text-yellow-600";
      return "text-red-600";
  };

  return (
    <div className="flex flex-col h-full bg-white text-foreground overflow-hidden relative">
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Script Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 text-lg leading-relaxed relative"
      >
        {/* Class Info Section */}
        {classInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-border">
                <h2 className="text-xl font-bold mb-2">{classInfo.title}</h2>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                    <div>
                        <span className="block text-gray-500 text-xs uppercase">Classroom</span>
                        {classInfo.classroom}
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs uppercase">Teacher</span>
                        {classInfo.teacher}
                    </div>
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs uppercase">Time</span>
                        {classInfo.time}
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-wrap gap-x-1.5 gap-y-2 pb-20"> {/* Padding bottom for controls */}
          {script.map((word, index) => {
            const isActive = index === activeWordIndex;
            const colorClass = getScoreColor(word.score);
            
            return (
              <span
                key={index}
                ref={isActive ? activeWordRef : null}
                onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick(word);
                }}
                className={cn(
                  "cursor-pointer transition-all duration-200 px-0.5 rounded",
                  isActive ? "bg-yellow-200 scale-105 font-bold text-black" : colorClass,
                )}
              >
                {word.word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Word Popup (Enhanced) */}
      {selectedWord && (
          <div className="absolute bottom-[140px] left-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-5 z-20 overflow-hidden">
              {/* Header: Word Title */}
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="text-xl font-bold text-foreground">{selectedWord.word}</h3>
                  <button onClick={() => setSelectedWord(null)} className="text-gray-400 hover:text-gray-600 p-1">
                      <X size={20} />
                  </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Section 1: Standard Pronunciations (UK / US) */}
                <div className="flex divide-x divide-gray-100">
                    <div className="flex-1 flex flex-col items-center gap-1 px-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">UK</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-600">/{selectedWord.phonemes_uk || selectedWord.phonemes}/</span>
                            <button className="text-blue-500 hover:bg-blue-50 p-1 rounded-full">
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1 px-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">US</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-600">/{selectedWord.phonemes_us || selectedWord.phonemes}/</span>
                            <button className="text-blue-500 hover:bg-blue-50 p-1 rounded-full">
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Section 2: User Performance */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Your Pronunciation</span>
                        <div className="flex items-center gap-2">
                             <span className={cn(
                                 "font-mono text-sm",
                                 (selectedWord.score || 0) >= 80 ? "text-green-600" : "text-red-500"
                             )}>
                                 /{selectedWord.user_phonemes || " - "}/
                             </span>
                             {/* User Audio Replay Icon (if available) */}
                             {selectedWord.user_phonemes && (
                                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                                    <Play size={14} fill="currentColor" />
                                </button>
                             )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                        <div className={cn("text-2xl font-black leading-none", getScoreColor(selectedWord.score))}>
                             {selectedWord.score || "-"}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Footer Buttons */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedWord(null)}
                        className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm"
                    >
                        Close
                    </button>
                    <button 
                        onClick={() => setShowPractice(true)}
                        className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Mic size={16} />
                        Practice
                    </button>
                </div>
              </div>
          </div>
      )}
      
      {/* Practice Dialog Modal */}
      {showPractice && selectedWord && (
          <WordPracticeDialog 
            word={selectedWord} 
            onClose={() => setShowPractice(false)} 
          />
      )}

      {/* Control Bar (Fixed Bottom) */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-8">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button 
                onClick={togglePlay}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-transform shrink-0"
            >
                {state.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1"/>}
            </button>

            {/* Progress Bar & Time */}
            <div className="flex-1 flex flex-col justify-center gap-1">
                <input
                    type="range"
                    min={0}
                    max={state.duration || 100}
                    value={state.currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium px-0.5">
                    <span>{formatTime(state.currentTime)}</span>
                    <span>{formatTime(state.duration)}</span>
                </div>
            </div>

            {/* Speed Control */}
             <button 
                onClick={() => {
                    const rates = [0.8, 1.0, 1.2, 1.5];
                    const nextIndex = (rates.indexOf(state.playbackRate) + 1) % rates.length;
                    setPlaybackRate(rates[nextIndex]);
                }}
                className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1.5 min-w-[3rem] text-center transition-colors shrink-0"
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

