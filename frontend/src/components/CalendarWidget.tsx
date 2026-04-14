"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCalendar } from '@/hooks/ui/useCalendar';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar as CalendarIcon, List } from 'lucide-react';
import { isSameDay } from '@/lib/dateUtils';
import { CLASS_PERIODS } from '@/lib/mockData';

// Filter only class periods (exclude breaks like LUNCH, DINNER)
const DISPLAY_PERIODS = CLASS_PERIODS.filter(p => typeof p.period === 'number') as {
  period: number;
  startTime: string;
  endTime: string;
  label: string;
}[];

export function CalendarWidget() {
  const router = useRouter();
  const { 
    currentDate, 
    selectedDate, 
    days, 
    weekDays,
    next, 
    prev, 
    setSelectedDate, 
    getEventsForDate,
    view,
    setView
  } = useCalendar();

  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const eventListRef = useRef<HTMLDivElement>(null);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    eventListRef.current?.scrollTo({ top: 0 });
  }, [setSelectedDate]);

  const selectedEvents = getEventsForDate(selectedDate);
  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const visibleDays = useMemo(() => {
    if (isCalendarExpanded) return days;
    const selectedIdx = days.findIndex(d => isSameDay(d.date, selectedDate));
    if (selectedIdx === -1) return days.slice(0, 7);
    const rowStart = Math.floor(selectedIdx / 7) * 7;
    return days.slice(rowStart, rowStart + 7);
  }, [days, selectedDate, isCalendarExpanded]);

  // Helper to calculate top/height for week view events based on period index
  const getEventStyle = (startTime: string, endTime: string) => {
    const periodIndex = DISPLAY_PERIODS.findIndex(p => p.startTime === startTime);
    if (periodIndex === -1) {
      // Fallback for events that don't match exact period times
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const firstPeriodStart = 8 * 60; // 08:00
      const startOffset = ((startH * 60 + startM) - firstPeriodStart) / 45 * 50;
      const duration = ((endH * 60 + endM) - (startH * 60 + startM)) / 45 * 50;
      return { top: `${startOffset}px`, height: `${Math.max(duration, 45)}px` };
    }
    
    // Each period row is 50px height
    const top = periodIndex * 50;
    const periodCount = DISPLAY_PERIODS.filter(p => p.startTime >= startTime && p.startTime < endTime).length || 1;
    const height = periodCount * 50;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white z-10">
        <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">
            {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => setView(view === 'month' ? 'week' : 'month')} className="p-1 rounded hover:bg-gray-100">
                {view === 'month' ? <List size={16}/> : <CalendarIcon size={16}/>}
            </button>
        </div>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1.5 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="p-1.5 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {view === 'month' && (
          <>
          <div className={cn(
            "p-2 flex-shrink-0 transition-all duration-300 overflow-hidden",
          )}>
            <div className="grid grid-cols-7 mb-2 text-center text-xs text-muted-foreground font-medium">
                {weekDayNames.map((d, i) => (
                    <div key={d} className={cn(
                        i === 0 && "text-red-500",
                        i === 6 && "text-blue-500"
                    )}>
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {visibleDays.map((day, idx) => {
                const dayEvents = getEventsForDate(day.date);
                const isSelected = isSameDay(day.date, selectedDate);
                const isToday = isSameDay(day.date, new Date());
                const dayOfWeek = day.date.getDay();

                return (
                    <div 
                    key={idx} 
                    onClick={() => handleSelectDate(day.date)}
                    className={cn(
                        "flex flex-col items-center p-1 cursor-pointer relative rounded-md transition-colors",
                        isCalendarExpanded ? "min-h-[44px]" : "min-h-[38px]",
                        !day.isCurrentMonth && "opacity-30",
                        isSelected && "bg-blue-50"
                    )}
                    >
                    <span className={cn(
                        "text-sm w-7 h-7 flex items-center justify-center rounded-full mb-0.5",
                        isToday && "bg-blue-600 text-white font-bold",
                        !isToday && isSelected && "text-blue-600 font-bold",
                        !isToday && !isSelected && dayOfWeek === 0 && "text-red-500",
                        !isToday && !isSelected && dayOfWeek === 6 && "text-blue-500"
                    )}>
                        {day.date.getDate()}
                    </span>
                    
                    <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((ev, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                ev.status === 'completed' && 'bg-green-500',
                                ev.status === 'absent' && 'bg-red-500',
                                ev.status === 'upcoming' && 'bg-blue-400',
                            )} 
                        />
                        ))}
                        {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                    </div>
                    </div>
                );
                })}
            </div>
        </div>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsCalendarExpanded(prev => !prev)}
          className="flex items-center justify-center py-1 border-t border-b bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {isCalendarExpanded ? (
              <>
                <ChevronUp size={14} />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>Expand</span>
              </>
            )}
          </div>
        </button>

        {/* Selected Date Details (Bottom Sheet style for Month View) */}
        <div ref={eventListRef} className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            
            <div className="space-y-3">
                {selectedEvents.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No events</div>
                ) : (
                    selectedEvents.map(event => (
                        <div key={event.id} className={cn(
                            "bg-white p-3 rounded-lg border shadow-sm flex items-center gap-3",
                            event.status === 'absent' && "bg-red-50/50"
                        )}>
                            <div className={cn(
                                "w-1 h-10 rounded-full",
                                event.status === 'completed' && 'bg-green-500',
                                event.status === 'absent' && 'bg-red-500',
                                event.status === 'upcoming' && 'bg-blue-400',
                            )} />
                            <div 
                                className={cn(
                                    "flex-1 p-1 rounded",
                                    event.status !== 'absent' && "cursor-pointer hover:bg-gray-50"
                                )}
                                onClick={() => event.status !== 'absent' && router.push(`/class/${event.id}`)}
                            >
                                <h4 className={cn(
                                    "font-medium text-sm",
                                    event.status === 'absent' && "text-red-700"
                                )}>{event.title}</h4>
                                <div className="flex gap-2 text-xs text-gray-500">
                                    <span>{event.startTime} - {event.endTime}</span>
                                    {event.classroom && <span>{event.classroom}</span>}
                                </div>
                            </div>
                            {event.status === 'completed' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>
                            )}
                            {event.status === 'absent' && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Absent</span>
                            )}
                            {event.status === 'upcoming' && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Upcoming</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
        </>
      )}

      {/* WEEK VIEW */}
      {view === 'week' && (
        <div className="flex flex-col flex-1 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto relative">
                {/* Week Header (Sticky inside scroll container) */}
                <div className="sticky top-0 z-30 grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b bg-gray-50 shadow-sm">
                    <div className="p-2 border-r bg-gray-100 text-[10px] text-gray-500 text-center font-medium">
                      Period
                    </div>
                    {weekDays.map((day, idx) => {
                        const isToday = isSameDay(day, new Date());
                        const dayOfWeek = day.getDay();
                        
                        return (
                            <div key={idx} className="p-2 text-center border-r last:border-r-0 bg-gray-50 min-w-0">
                                <div className={cn(
                                    "text-xs text-gray-500 mb-1 truncate",
                                    dayOfWeek === 0 && "text-red-500",
                                    dayOfWeek === 6 && "text-blue-500"
                                )}>{weekDayNames[dayOfWeek]}</div>
                                <div className={cn(
                                    "w-7 h-7 mx-auto flex items-center justify-center rounded-full text-sm",
                                    isToday ? "bg-blue-600 text-white font-bold" : "font-medium",
                                    !isToday && dayOfWeek === 0 && "text-red-500",
                                    !isToday && dayOfWeek === 6 && "text-blue-500"
                                )}>
                                    {day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Time Grid */}
                <div className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr]" style={{ minHeight: `${DISPLAY_PERIODS.length * 50}px` }}>
                    
                    {/* Period Column (Sticky Left) */}
                    <div className="border-r bg-gray-50 sticky left-0 z-20">
                        {DISPLAY_PERIODS.map(period => (
                            <div key={period.period} className="h-[50px] text-[10px] text-gray-500 px-1 py-1 border-b flex flex-col justify-center">
                                <div className="font-bold text-gray-700">{period.label}</div>
                                <div className="text-gray-400">{period.startTime}</div>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    {weekDays.map((day, idx) => {
                         const dayEvents = getEventsForDate(day);
                         const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                         
                         return (
                            <div key={idx} className={cn(
                              "border-r last:border-r-0 relative min-w-0",
                              isWeekend ? "bg-gray-50" : "bg-white"
                            )}>
                                {/* Grid Lines */}
                                {DISPLAY_PERIODS.map(period => (
                                    <div key={period.period} className="h-[50px] border-b border-gray-100" />
                                ))}
                                
                                {/* Events */}
                                {dayEvents.map(event => {
                                    if (!event.startTime || !event.endTime) return null;
                                    const style = getEventStyle(event.startTime, event.endTime);
                                    
                                    return (
                                        <div
                                            key={event.id}
                                            style={style}
                                            onClick={() => event.status !== 'absent' && router.push(`/class/${event.id}`)}
                                            className={cn(
                                                "absolute inset-x-0.5 rounded p-1 text-[10px] overflow-hidden shadow-sm border-l-2 opacity-90 z-10 transition-all",
                                                event.status !== 'absent' && 'cursor-pointer hover:brightness-95',
                                                event.status === 'completed' && 'bg-green-100 border-green-500 text-green-800',
                                                event.status === 'absent' && 'bg-red-100 border-red-500 text-red-800',
                                                event.status === 'upcoming' && 'bg-blue-50 border-blue-400 text-blue-800',
                                            )}
                                        >
                                            <div className="font-bold truncate">{event.title}</div>
                                            <div className="truncate">
                                              {event.status === 'absent' ? 'Absent' : event.classroom}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                         );
                    })}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
