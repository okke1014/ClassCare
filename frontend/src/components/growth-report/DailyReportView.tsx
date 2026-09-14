"use client";

import { Sparkles, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { DAILY_REPORT } from "@/lib/growthReportData";
import { BilingualSummary } from "./BilingualSummary";
import { ScoreRing } from "./ScoreRing";

const COLOR = "#0284C7"; // sky-600

interface DailyReportViewProps {
  nativeLanguage?: NativeLanguage;
}

export function DailyReportView({ nativeLanguage }: DailyReportViewProps) {
  const data = DAILY_REPORT;

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-sky-700 uppercase">
          Today&apos;s Learning Snapshot
        </span>
        <span className="text-xs text-gray-400">{data.date}</span>
      </div>

      <div className="flex items-center gap-3">
        <ScoreRing score={data.score} color={COLOR} />
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span className="text-sm font-bold text-gray-900">{data.level}</span>
            <span className="text-xs text-gray-500">({data.levelLabel})</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 leading-snug">{data.lessonTitle}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-sky-100/70 rounded-xl border border-sky-200 p-3">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <BilingualSummary
          text={data.highlight}
          nativeLanguage={nativeLanguage}
          englishClassName="text-sky-900 font-medium"
          translationClassName="text-sky-700/80 border-sky-300/60"
        />
      </div>

      <BilingualSummary
        text={data.reflection}
        nativeLanguage={nativeLanguage}
        className="bg-white/70 rounded-xl border border-sky-100 p-3"
      />

      <div className="flex items-start gap-2 bg-white rounded-xl border border-sky-200 p-3">
        <Target className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-sky-700 uppercase mb-1">Try This Tonight</p>
          <BilingualSummary text={data.actionTip} nativeLanguage={nativeLanguage} englishClassName="text-gray-700" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.focusAreas.map((area) => (
          <span
            key={area}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-100 text-sky-700"
          >
            Keep Practicing: {area}
          </span>
        ))}
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Effort &amp; Consistency (This Week, Mon–Fri)</h3>
        <div className="h-44 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyFocus} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0F2FE" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend
                formatter={(value) =>
                  value === "grammar" ? "Grammar Accuracy" : value === "fluency" ? "Fluency" : "Vocabulary in Class"
                }
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="grammar" fill="#0284C7" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fluency" fill="#38BDF8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="vocabulary" fill="#BAE6FD" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
