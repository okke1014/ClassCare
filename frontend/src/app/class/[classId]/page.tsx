"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AudioScriptPlayer, Word } from "@/components/AudioScriptPlayer";
import { ChevronLeft, MoreVertical, Share2 } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mockData";

// Mock Data for the script
const MOCK_SCRIPT: Word[] = [
  { word: "The", start_time: 0, end_time: 0.2, score: 90, phonemes: "ð ə", phonemes_uk: "ð ə", phonemes_us: "ð ə", user_phonemes: "ð ə" },
  { word: "best", start_time: 0.2, end_time: 0.5, score: 85, phonemes: "b ɛ s t", phonemes_uk: "b ɛ s t", phonemes_us: "b ɛ s t", user_phonemes: "b ɛ s t" },
  { word: "time", start_time: 0.5, end_time: 0.8, score: 92, phonemes: "t aɪ m", phonemes_uk: "t aɪ m", phonemes_us: "t aɪ m", user_phonemes: "t aɪ m" },
  { word: "to", start_time: 0.8, end_time: 0.9, score: 88, phonemes: "t u", phonemes_uk: "t u", phonemes_us: "t u", user_phonemes: "t u" },
  { word: "visit", start_time: 0.9, end_time: 1.2, score: 95, phonemes: "v ɪ z ɪ t", phonemes_uk: "v ɪ z ɪ t", phonemes_us: "v ɪ z ɪ t", user_phonemes: "v ɪ z ɪ t" },
  { word: "Canada", start_time: 1.2, end_time: 1.8, score: 60, phonemes: "k æ n ə d ə", phonemes_uk: "k æ n ə d ə", phonemes_us: "k æ n ə d ə", user_phonemes: "k æ n ə" }, 
  { word: "is", start_time: 1.8, end_time: 2.0, score: 90, phonemes: "ɪ z", phonemes_uk: "ɪ z", phonemes_us: "ɪ z", user_phonemes: "ɪ z" },
  { word: "during", start_time: 2.0, end_time: 2.4, score: 85, phonemes: "d ʊ r ɪ ŋ", phonemes_uk: "d j ʊə r ɪ ŋ", phonemes_us: "d ʊ r ɪ ŋ", user_phonemes: "d ʊ r ɪ ŋ" },
  { word: "fall", start_time: 2.4, end_time: 2.7, score: 88, phonemes: "f ɔ l", phonemes_uk: "f ɔː l", phonemes_us: "f ɔ l", user_phonemes: "f ɔ l" },
  { word: "months", start_time: 2.7, end_time: 3.2, score: 45, phonemes: "m ʌ n θ s", phonemes_uk: "m ʌ n θ s", phonemes_us: "m ʌ n θ s", user_phonemes: "m ʌ n s" }, 
  { word: "when", start_time: 3.2, end_time: 3.4, score: 90, phonemes: "w ɛ n", phonemes_uk: "w ɛ n", phonemes_us: "w ɛ n", user_phonemes: "w ɛ n" },
  { word: "mild", start_time: 3.4, end_time: 3.8, score: 85, phonemes: "m aɪ l d", phonemes_uk: "m aɪ l d", phonemes_us: "m aɪ l d", user_phonemes: "m aɪ d" },
  { word: "temperatures", start_time: 3.8, end_time: 4.5, score: 80, phonemes: "t ɛ m p r ə tʃ ər z", phonemes_uk: "t ɛ m p r ə tʃ ə z", phonemes_us: "t ɛ m p r ə tʃ ər z", user_phonemes: "t ɛ m p tʃ ər z" },
  { word: "and", start_time: 4.5, end_time: 4.7, score: 90, phonemes: "æ n d", phonemes_uk: "æ n d", phonemes_us: "æ n d", user_phonemes: "æ n d" },
  { word: "vibrant", start_time: 4.7, end_time: 5.2, score: 75, phonemes: "v aɪ b r ə n t", phonemes_uk: "v aɪ b r ə n t", phonemes_us: "v aɪ b r ə n t", user_phonemes: "v aɪ b r ə n" },
  { word: "fall", start_time: 5.2, end_time: 5.5, score: 88, phonemes: "f ɔ l", phonemes_uk: "f ɔː l", phonemes_us: "f ɔ l", user_phonemes: "f ɔ l" },
  { word: "foliage", start_time: 5.5, end_time: 6.2, score: 55, phonemes: "f oʊ l i ɪ dʒ", phonemes_uk: "f əʊ l i ɪ dʒ", phonemes_us: "f oʊ l i ɪ dʒ", user_phonemes: "f oʊ l ɪ dʒ" },
  { word: "make", start_time: 6.2, end_time: 6.5, score: 90, phonemes: "m eɪ k", phonemes_uk: "m eɪ k", phonemes_us: "m eɪ k", user_phonemes: "m eɪ k" },
  { word: "scenic", start_time: 6.5, end_time: 7.0, score: 85, phonemes: "s i n ɪ k", phonemes_uk: "s iː n ɪ k", phonemes_us: "s i n ɪ k", user_phonemes: "s i n ɪ k" },
  { word: "drives", start_time: 7.0, end_time: 7.5, score: 88, phonemes: "d r aɪ v z", phonemes_uk: "d r aɪ v z", phonemes_us: "d r aɪ v z", user_phonemes: "d r aɪ v z" },
];

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { classId } = params;

  // Find event from shared mock data
  const event = MOCK_EVENTS.find(e => e.id === classId);

  // Using Mock Data
  const audioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"; // Public mock audio
  
  const classInfo = event ? {
      title: event.title,
      classroom: event.classroom || "Unknown Room",
      teacher: event.teacher || "Unknown Teacher",
      time: event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : "Time N/A"
  } : undefined;

  if (!event) return <div className="p-4">Class not found</div>;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white z-10 shrink-0">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <Image
              src="/images/ev-system-logo.png"
              alt="EV Academy"
              width={100}
              height={28}
              className="h-6 w-auto"
              priority
            />
            <span className="text-xs text-muted-foreground mt-0.5">{event.title}</span>
        </div>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} />
            </button>
        </div>
      </div>

      {/* Main Content (Player) */}
      <div className="flex-1 overflow-hidden">
          <AudioScriptPlayer 
            audioUrl={audioUrl} 
            script={MOCK_SCRIPT}
            classInfo={classInfo} 
          />
      </div>
    </div>
  );
}





