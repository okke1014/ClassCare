"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarX } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { AudioScriptPlayer } from "@/components/AudioScriptPlayer";
import { EmptyState } from "@/components/EmptyState";
import { MOCK_EVENTS } from "@/lib/mockData";
import { STT_ANALYSIS } from "@/lib/sttData";
import { STT_ANALYSIS_CONDENSED } from "@/lib/sttDataCondensed";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { classId } = params;

  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUsername(JSON.parse(stored).username || "");
    } catch {}
  }, []);

  const event = MOCK_EVENTS.find(e => e.id === classId);

  const sttData = username === "student1" ? STT_ANALYSIS_CONDENSED : STT_ANALYSIS;
  const nativeLanguage = username === "student1" ? "ja" : "ko";
  const studentName = "Eric";
  const { lesson_metadata, transcript, learning_report, skill_up_recommendations } = sttData;

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

  if (!event) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <AppHeader onBack={() => router.back()} />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={CalendarX}
            title="Class not found"
            description="This class may have been removed or the link is no longer valid."
            action={{
              label: "Back to calendar",
              onClick: () => router.push("/student/dashboard"),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader onBack={() => router.back()} />

      <div className="flex-1 overflow-hidden">
        <AudioScriptPlayer
          audioUrl={lesson_metadata.audio_url}
          transcript={transcript}
          classInfo={classInfo}
          overallScore={lesson_metadata.overall_pronunciation_score}
          learningReport={learning_report}
          recommendations={skill_up_recommendations}
          nativeLanguage={nativeLanguage}
          studentName={studentName}
        />
      </div>
    </div>
  );
}
