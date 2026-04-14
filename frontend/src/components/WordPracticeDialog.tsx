"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, X, Loader2 } from "lucide-react";
import type { STTWord } from "@/lib/sttData";
import { cn } from "@/lib/utils";

interface WordPracticeDialogProps {
  word: STTWord;
  onClose: () => void;
}

export function WordPracticeDialog({ word, onClose }: WordPracticeDialogProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ score: number; text: string; phonemes: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Placeholder for model loading
  useEffect(() => {
    // In real app: Load Transformers.js model here
    // const loadModel = async () => { ... }
    // loadModel();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResult(null);
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate processing delay (Transformers.js inference time)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Result Generation based on word
    // In real app: Use Transformers.js pipeline('automatic-speech-recognition') here
    // const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    // const out = await transcriber(audioUrl);
    
    // Random mock score logic for demo
    const randomScore = Math.floor(Math.random() * 40) + 60; // 60-100
    setResult({
        score: randomScore,
        text: word.text,
        phonemes: word.dictionary_phonetic?.us || "",
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg">Practice Pronunciation</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-1">{word.text}</h2>
            {word.dictionary_phonetic && (
              <p className="text-gray-500 font-mono text-lg">{word.dictionary_phonetic.us}</p>
            )}
          </div>

          {/* Result Display */}
          {result && (
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 text-center animate-in zoom-in-95">
                  <div className="text-xs text-blue-600 font-bold uppercase mb-1">Your Score</div>
                  <div className={cn(
                      "text-4xl font-black",
                      result.score >= 80 ? "text-green-600" : 
                      result.score >= 50 ? "text-yellow-600" : "text-red-600"
                  )}>
                      {result.score}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 flex justify-center gap-2">
                      <span>Recognized:</span>
                      <span className="font-bold">{result.text}</span>
                  </div>
              </div>
          )}

          {/* Error Display */}
          {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded w-full">
                  {error}
              </div>
          )}

          {/* Recording Status */}
          {isProcessing && (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Loader2 className="animate-spin" />
                  <span className="text-sm">Analyzing pronunciation...</span>
              </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-6 pt-0 flex justify-center">
            {!isRecording ? (
                <button 
                    onClick={startRecording}
                    disabled={isProcessing}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Mic size={24} />
                    {result ? "Try Again" : "Tap to Record"}
                </button>
            ) : (
                <button 
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-all animate-pulse"
                >
                    <Square size={24} fill="currentColor" />
                    Stop Recording
                </button>
            )}
        </div>
      </div>
    </div>
  );
}





