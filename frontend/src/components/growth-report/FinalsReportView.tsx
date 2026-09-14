"use client";

import { Compass } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NativeLanguage } from "@/lib/analysisTranslations";
import { FINALS_REPORT } from "@/lib/growthReportData";
import { BilingualSummary } from "./BilingualSummary";
import { ScoreRing } from "./ScoreRing";

const COLOR = "#F59E0B"; // amber-500

interface FinalsReportViewProps {
  nativeLanguage?: NativeLanguage;
}

export function FinalsReportView({ nativeLanguage }: FinalsReportViewProps) {
  const data = FINALS_REPORT;

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 via-yellow-50 to-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-amber-700 uppercase">
          Certificate of Achievement
        </span>
        <span className="text-lg">🎓</span>
      </div>

      <div className="flex items-center gap-3">
        <ScoreRing score={data.score} color={COLOR} trackColor="#FDE68A" />
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span className="text-sm font-bold text-gray-900">{data.level}</span>
            <span className="text-xs text-gray-500">({data.levelLabel})</span>
          </div>
          <p className="text-xs text-gray-500">Your Growth Journey, Complete</p>
        </div>
      </div>

      <BilingualSummary
        text={data.congratsMessage}
        nativeLanguage={nativeLanguage}
        className="bg-white/80 rounded-xl border border-amber-100 p-3"
      />

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Mastery Breakdown</h3>
        <div className="flex items-center gap-4">
          <div className="h-32 w-32 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.moduleCompletion}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={38}
                  outerRadius={56}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.moduleCompletion.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-gray-900">{data.level}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {data.moduleCompletion.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: m.color }} />
                  {m.name}
                </span>
                <span className="font-semibold text-gray-900">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2">Your Growth Journey</h3>
        <div className="h-36 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.levelProgress} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="finalsLevelFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FDE68A" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#B45309" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 6]} tick={{ fontSize: 10, fill: "#B45309" }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area
                type="monotone"
                dataKey="level"
                stroke={COLOR}
                strokeWidth={2.5}
                fill="url(#finalsLevelFill)"
                dot={{ r: 3, fill: COLOR }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-white rounded-xl border border-amber-200 p-3">
        <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-amber-700 uppercase mb-1">What&apos;s Next</p>
          <BilingualSummary text={data.whatsNext} nativeLanguage={nativeLanguage} englishClassName="text-gray-700" />
        </div>
      </div>
    </div>
  );
}
