export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string; // "14:00"
  endTime?: string;   // "15:00"
  type: 'class' | 'assignment' | 'exam';
  status: 'pending' | 'completed' | 'absent' | 'upcoming';
  classroom?: string;
  teacher?: string;
}

export const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const addWeeks = (date: Date, weeks: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (weeks * 7));
    return d;
};

export const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

export const getWeekDays = (date: Date) => {
    const start = getStartOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(addDays(start, i));
    }
    return days;
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const generateMonthGrid = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Previous month padding
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month padding (to complete 42 cells grid - 6 rows)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
};





