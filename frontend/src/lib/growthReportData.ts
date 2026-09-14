// Mock growth-report data for the student growth report feature.
// Content is intentionally framed around growth-mindset coaching: what went
// well, what to work on next, and one concrete actionable step — rather than
// a plain analytics dump.

export interface DailyFocusPoint {
  day: string;
  grammar: number;
  fluency: number;
  vocabulary: number;
}

export interface DailyReport {
  level: string;
  levelLabel: string;
  score: number;
  date: string;
  lessonTitle: string;
  highlight: string;
  reflection: string;
  actionTip: string;
  focusAreas: string[];
  weeklyFocus: DailyFocusPoint[];
}

export interface SkillPoint {
  skill: string;
  value: number;
}

export interface WeeklyTrendPoint {
  label: string;
  value: number;
}

export interface WeeklyReport {
  level: string;
  levelLabel: string;
  score: number;
  weekRange: string;
  summary: string;
  coachTip: string;
  trend: WeeklyTrendPoint[];
  skills: SkillPoint[];
}

export interface MonthlyTrendPoint {
  label: string;
  thisMonth: number;
  lastMonth: number;
}

export interface MonthlyReport {
  level: string;
  levelLabel: string;
  score: number;
  month: string;
  summary: string;
  milestone: string;
  nextFocus: string;
  skillRadar: SkillPoint[];
  trend: MonthlyTrendPoint[];
}

export interface ModuleCompletion {
  name: string;
  value: number;
  color: string;
}

export interface LevelProgressPoint {
  label: string;
  level: number;
}

export interface FinalsReport {
  level: string;
  levelLabel: string;
  score: number;
  congratsMessage: string;
  whatsNext: string;
  moduleCompletion: ModuleCompletion[];
  levelProgress: LevelProgressPoint[];
}

export const DAILY_REPORT: DailyReport = {
  level: "B1",
  levelLabel: "Intermediate",
  score: 70,
  date: "2026-09-15",
  lessonTitle: "Lesson: Introduction to Future Tense",
  highlight: "You built several complete future-tense sentences on your own today — great progress!",
  reflection:
    "Your grasp of the future tense basics is solid. Irregular verbs are still tripping you up sometimes, but that's a normal part of learning — a little daily practice will make it click.",
  actionTip: "Tonight, try writing 3 sentences about your weekend plans using 'will' + an irregular verb.",
  focusAreas: ["Irregular Verbs", "Sentence Intonation"],
  weeklyFocus: [
    { day: "Mon", grammar: 65, fluency: 60, vocabulary: 68 },
    { day: "Tue", grammar: 68, fluency: 63, vocabulary: 70 },
    { day: "Wed", grammar: 70, fluency: 66, vocabulary: 71 },
    { day: "Thu", grammar: 71, fluency: 68, vocabulary: 73 },
    { day: "Fri", grammar: 74, fluency: 70, vocabulary: 75 },
  ],
};

export const WEEKLY_REPORT: WeeklyReport = {
  level: "B1",
  levelLabel: "Intermediate",
  score: 80,
  weekRange: "Sep Week 2",
  summary:
    "You're building real momentum — your sentences are flowing more naturally and you're speaking with more confidence than last week. Grammar accuracy is catching up nicely too.",
  coachTip: "Next week, slow down slightly when linking ideas together — this will help your sentences connect more smoothly.",
  trend: [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 66 },
    { label: "Wed", value: 70 },
    { label: "Thu", value: 74 },
    { label: "Fri", value: 80 },
  ],
  skills: [
    { skill: "Speaking", value: 78 },
    { skill: "Listening", value: 82 },
    { skill: "Reading", value: 75 },
    { skill: "Writing", value: 68 },
  ],
};

export const MONTHLY_REPORT: MonthlyReport = {
  level: "B2",
  levelLabel: "Upper-intermediate",
  score: 90,
  month: "September 2026",
  summary:
    "This month marks a real turning point — everyday conversation now feels natural, and you're handling more complex grammar with growing accuracy. Your consistency is really paying off.",
  milestone: "Milestone reached: you've grown from B1 to B2 this month!",
  nextFocus:
    "Next month, focus on smoothing transitions between sentences in your writing — try connector words like 'however' and 'therefore'.",
  skillRadar: [
    { skill: "Speaking", value: 88 },
    { skill: "Reading", value: 85 },
    { skill: "Listening", value: 92 },
    { skill: "Writing", value: 78 },
  ],
  trend: [
    { label: "Mon", thisMonth: 72, lastMonth: 60 },
    { label: "Tue", thisMonth: 76, lastMonth: 63 },
    { label: "Wed", thisMonth: 80, lastMonth: 66 },
    { label: "Thu", thisMonth: 83, lastMonth: 70 },
    { label: "Fri", thisMonth: 87, lastMonth: 74 },
    { label: "Sat", thisMonth: 90, lastMonth: 77 },
  ],
};

export const FINALS_REPORT: FinalsReport = {
  level: "C1",
  levelLabel: "Advanced",
  score: 96,
  congratsMessage:
    "You've come an incredible distance — from your very first lesson to confidently discussing complex ideas at a C1 level. Your discipline, curiosity, and consistent effort made this possible.",
  whatsNext: "Keep the momentum going — our Advanced Business English track is a great next step to keep sharpening your skills.",
  moduleCompletion: [
    { name: "Vocabulary", value: 96, color: "#FBBF24" },
    { name: "Grammar", value: 94, color: "#38BDF8" },
    { name: "Dialogue", value: 91, color: "#FB7185" },
  ],
  levelProgress: [
    { label: "Start", level: 0 },
    { label: "Level 1", level: 1 },
    { label: "Level 2", level: 2 },
    { label: "Level 3", level: 3 },
    { label: "Level 4", level: 4 },
    { label: "Level 5", level: 5 },
    { label: "Level 6", level: 6 },
  ],
};
