"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, CalendarRange, GraduationCap, Sunrise } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StudentNav } from "@/components/StudentNav";
import { cn } from "@/lib/utils";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { DailyReportView } from "@/components/growth-report/DailyReportView";
import { WeeklyReportView } from "@/components/growth-report/WeeklyReportView";
import { MonthlyReportView } from "@/components/growth-report/MonthlyReportView";
import { FinalsReportView } from "@/components/growth-report/FinalsReportView";

type ReportTab = "daily" | "weekly" | "monthly" | "finals";

const TABS: { id: ReportTab; label: string; icon: typeof Sunrise; activeClass: string }[] = [
  { id: "daily", label: "Daily", icon: Sunrise, activeClass: "bg-sky-600 text-white" },
  { id: "weekly", label: "Weekly", icon: CalendarClock, activeClass: "bg-rose-600 text-white" },
  { id: "monthly", label: "Monthly", icon: CalendarRange, activeClass: "bg-indigo-600 text-white" },
  { id: "finals", label: "Finals", icon: GraduationCap, activeClass: "bg-amber-500 text-white" },
];

export default function GrowthReportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReportTab>("daily");
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>("ko");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setNativeLanguage(user.username === "student1" ? "ja" : "ko");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Growth Report" onBack={() => router.push("/student/dashboard")} />

      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="grid grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors border",
                  isActive ? cn(tab.activeClass, "border-transparent shadow-sm") : "bg-gray-50 text-gray-500 border-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 bg-gray-50">
        {activeTab === "daily" && <DailyReportView nativeLanguage={nativeLanguage} />}
        {activeTab === "weekly" && <WeeklyReportView nativeLanguage={nativeLanguage} />}
        {activeTab === "monthly" && <MonthlyReportView nativeLanguage={nativeLanguage} />}
        {activeTab === "finals" && <FinalsReportView nativeLanguage={nativeLanguage} />}
      </div>

      <StudentNav />
    </div>
  );
}
