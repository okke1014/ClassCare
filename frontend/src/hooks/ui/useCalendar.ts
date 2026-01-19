import { useState, useMemo } from 'react';
import { addMonths, addWeeks, generateMonthGrid, isSameDay, getWeekDays } from '@/lib/dateUtils';
import { MOCK_EVENTS } from '@/lib/mockData';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 28)); // Start Jan 28, 2026 for demo
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 28));
  const [view, setView] = useState<'month' | 'week'>('month');

  const days = useMemo(() => {
    return generateMonthGrid(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const weekDays = useMemo(() => {
      return getWeekDays(currentDate);
  }, [currentDate]);

  const events = useMemo(() => MOCK_EVENTS, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(e => isSameDay(e.date, date));
  };

  const next = () => {
      if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
      else setCurrentDate(prev => addWeeks(prev, 1));
  };

  const prev = () => {
      if (view === 'month') setCurrentDate(prev => addMonths(prev, -1));
      else setCurrentDate(prev => addWeeks(prev, -1));
  };

  return {
    currentDate,
    selectedDate,
    view,
    setView,
    days,
    weekDays,
    next,
    prev,
    setSelectedDate,
    getEventsForDate,
  };
};





