"use client";

import { Compass } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { WEEKLY_REPORT } from "@/lib/growthReportData";
import { BilingualSummary } from "./BilingualSummary";
import { ScoreRing } from "./ScoreRing";

const COLOR = "#E11D48"; // rose-600

interface WeeklyReportViewProps {
  nativeLanguage?: NativeLanguage;
}

export function WeeklyReportView({ nativeLanguage }: WeeklyReportViewProps) {
  const data = WEEKLY_REPORT;
  const maxSkill = Math.max(...data.skills.map((s) => s.value));
  const growthSkill = data.skills.reduce((min, s) => (s.value < min.value ? s : min), data.skills[0]);

  return (
    <div className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-rose-700 uppercase">
          Weekly Momentum Report
        </span>
        <span className="text-xs text-gray-400">{data.weekRange}</span>
      </div>

      <div className="flex items-center gap-3">
        <ScoreRing score={data.score} color={COLOR} />
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span className="text-sm font-bold text-gray-900">{data.level}</span>
            <span className="text-xs text-gray-500">({data.levelLabel})</span>
          </div>
          <p className="text-xs text-gray-400">Momentum This Week</p>
        </div>
      </div>

      <BilingualSummary
        text={data.summary}
        nativeLanguage={nativeLanguage}
        className="bg-white/70 rounded-xl border border-rose-100 p-3"
      />

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Momentum Trend</h3>
        <div className="h-32 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="weeklyTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFE4E6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLOR}
                strokeWidth={2.5}
                fill="url(#weeklyTrendFill)"
                dot={{ r: 3, fill: COLOR }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Skill Balance</h3>
        <div className="space-y-2">
          {data.skills.map((skill) => (
            <div key={skill.skill} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-16 shrink-0">{skill.skill}</span>
              <div className="flex-1 h-2 rounded-full bg-rose-100 overflow-hidden">
                <div
                  className={skill.skill === growthSkill.skill ? "h-full rounded-full bg-rose-300" : "h-full rounded-full bg-rose-500"}
                  style={{ width: `${(skill.value / maxSkill) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-rose-700 w-8 text-right">{skill.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-rose-500 mt-1.5">
          Growth opportunity: <span className="font-semibold">{growthSkill.skill}</span> has the most room to grow this week.
        </p>
      </div>

      <div className="flex items-start gap-2 bg-white rounded-xl border border-rose-200 p-3">
        <Compass className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-rose-700 uppercase mb-1">Coach&apos;s Tip for Next Week</p>
          <BilingualSummary text={data.coachTip} nativeLanguage={nativeLanguage} englishClassName="text-gray-700" />
        </div>
      </div>
    </div>
  );
}
