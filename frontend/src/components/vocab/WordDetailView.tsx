"use client";

import { CheckCircle2, Volume2, XCircle } from "lucide-react";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import type { VocabWordWithProgress } from "@/hooks/domain/useVocabProgress";

interface WordDetailViewProps {
  word: VocabWordWithProgress;
  nativeLanguage?: NativeLanguage;
  onMarkFamiliar: (id: string) => void;
  onMarkUnfamiliar: (id: string) => void;
}

export function WordDetailView({ word, nativeLanguage, onMarkFamiliar, onMarkUnfamiliar }: WordDetailViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-2xl font-bold text-teal-600">{word.word}</h2>
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
              word.status === "familiar" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"
            )}
          >
            {word.status === "familiar" ? "Familiar" : "Unfamiliar"}
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          {(["UK", "US"] as const).map((accent) => (
            <button
              key={accent}
              type="button"
              onClick={() => speak(word.word, accent)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              <span className="text-gray-400">[{accent}]</span>
              {word.phonetic.uk || word.phonetic.us ? (
                <span className="font-mono">{accent === "UK" ? word.phonetic.uk : word.phonetic.us}</span>
              ) : (
                <span className="text-gray-400 italic">Listen</span>
              )}
              <Volume2 className="w-4 h-4 text-teal-600" />
            </button>
          ))}
        </div>

        {word.definitions.length > 0 && (
          <div className="border-t pt-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">Definitions</p>
            <div className="space-y-3">
              {word.definitions.map((def, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="text-gray-400 mr-1.5">[{def.pos}]</span>
                    {def.text}
                  </p>
                  {nativeLanguage && def.translation[nativeLanguage] && (
                    <p className="text-xs text-gray-400 leading-relaxed mt-1 pl-[1.6em]">
                      {def.translation[nativeLanguage]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {word.examples.length > 0 && (
          <div className="border-t pt-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">Examples</p>
            <div className="space-y-3">
              {word.examples.map((example, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-700 leading-relaxed">{example.text}</p>
                  {nativeLanguage && example.translation[nativeLanguage] && (
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">
                      {example.translation[nativeLanguage]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {word.definitions.length === 0 && word.examples.length === 0 && (
          <div className="border-t pt-4">
            <p className="text-xs text-gray-400 mb-2">Meaning</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{word.meaning}</p>
          </div>
        )}
      </div>

      <div className="flex items-stretch border-t shrink-0">
        <button
          type="button"
          onClick={() => onMarkUnfamiliar(word.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <XCircle className="w-4 h-4 text-rose-500" />
          Unfamiliar
        </button>
        <div className="w-px bg-border" />
        <button
          type="button"
          onClick={() => onMarkFamiliar(word.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-500" />
          Familiar
        </button>
      </div>
    </div>
  );
}
