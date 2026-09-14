"use client";

import { PartyPopper, Rocket } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { MONTHLY_REPORT } from "@/lib/growthReportData";
import { BilingualSummary } from "./BilingualSummary";
import { ScoreRing } from "./ScoreRing";

const COLOR = "#4F46E5"; // indigo-600

interface MonthlyReportViewProps {
  nativeLanguage?: NativeLanguage;
}

export function MonthlyReportView({ nativeLanguage }: MonthlyReportViewProps) {
  const data = MONTHLY_REPORT;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-indigo-700 uppercase">
          Monthly Mastery Report
        </span>
        <span className="text-xs text-gray-400">{data.month}</span>
      </div>

      <div className="flex items-center gap-3">
        <ScoreRing score={data.score} color={COLOR} />
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span className="text-sm font-bold text-gray-900">{data.level}</span>
            <span className="text-xs text-gray-500">({data.levelLabel})</span>
          </div>
          <p className="text-xs text-gray-400">This Month&apos;s Skill Profile</p>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-indigo-100/70 rounded-xl border border-indigo-200 p-3">
        <PartyPopper className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <BilingualSummary
          text={data.milestone}
          nativeLanguage={nativeLanguage}
          englishClassName="text-indigo-900 font-medium"
          translationClassName="text-indigo-700/80 border-indigo-300/60"
        />
      </div>

      <BilingualSummary
        text={data.summary}
        nativeLanguage={nativeLanguage}
        className="bg-white/70 rounded-xl border border-indigo-100 p-3"
      />

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Skill Balance Map</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.skillRadar} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <PolarGrid stroke="#C7D2FE" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Radar
                name="This Month"
                dataKey="value"
                stroke={COLOR}
                fill={COLOR}
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Growth vs Last Month</h3>
        <div className="h-36 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E7FF" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend
                formatter={(value) => (value === "thisMonth" ? "This Month" : "Last Month")}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="lastMonth"
                stroke="#A5B4FC"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 3, fill: "#A5B4FC" }}
              />
              <Line
                type="monotone"
                dataKey="thisMonth"
                stroke={COLOR}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLOR }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-white rounded-xl border border-indigo-200 p-3">
        <Rocket className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-indigo-700 uppercase mb-1">Focus for Next Month</p>
          <BilingualSummary text={data.nextFocus} nativeLanguage={nativeLanguage} englishClassName="text-gray-700" />
        </div>
      </div>
    </div>
  );
}
