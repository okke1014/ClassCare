"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AudioScriptPlayer } from "@/components/AudioScriptPlayer";
import { ChevronLeft, MoreVertical, Share2 } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mockData";
import { STT_ANALYSIS } from "@/lib/sttData";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { classId } = params;

  const event = MOCK_EVENTS.find(e => e.id === classId);

  const { lesson_metadata, transcript, learning_report, skill_up_recommendations } = STT_ANALYSIS;

  const classInfo = event
    ? {
        title: event.title,
        classroom: event.classroom || lesson_metadata.classroom,
        teacher: event.teacher || lesson_metadata.teacher,
        time:
          event.startTime && event.endTime
            ? `${event.startTime} - ${event.endTime}`
            : "Time N/A",
      }
    : {
        title: lesson_metadata.topic,
        classroom: lesson_metadata.classroom,
        teacher: lesson_metadata.teacher,
        time: lesson_metadata.date,
      };

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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AudioScriptPlayer
          audioUrl={lesson_metadata.audio_url}
          transcript={transcript}
          classInfo={classInfo}
          overallScore={lesson_metadata.overall_pronunciation_score}
          learningReport={learning_report}
          recommendations={skill_up_recommendations}
        />
      </div>
    </div>
  );
}
