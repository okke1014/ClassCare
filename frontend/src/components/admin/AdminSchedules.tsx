"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, AlertCircle } from "lucide-react";
import { CLASS_PERIODS, MOCK_ROOMS, generateRoomSchedules, RoomSchedule } from "@/lib/mockData";

// Get class periods only (exclude breaks for grid display)
const CLASS_ONLY_PERIODS = CLASS_PERIODS.filter(
  p => typeof p.period === 'number'
) as { period: number; startTime: string; endTime: string; label: string }[];

export function AdminSchedules() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 5)); // Jan 5, 2026 (Monday)

  const dayOfWeek = selectedDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const schedules = useMemo(() => {
    return generateRoomSchedules(selectedDate);
  }, [selectedDate]);

  const prevDay = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  };

  const nextDay = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  };

  const getScheduleForRoom = (roomName: string): RoomSchedule[] => {
    return schedules.filter(s => s.roomName === roomName);
  };

  // Get rooms that have schedules for today
  const activeRooms = useMemo(() => {
    const roomNamesWithSchedules = new Set(schedules.map(s => s.roomName));
    return MOCK_ROOMS.filter(r => roomNamesWithSchedules.has(r.name));
  }, [schedules]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Date Navigation Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 shrink-0">
        <button onClick={prevDay} className="p-2 hover:bg-gray-200 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-sm">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h2>
          <span className="text-xs text-gray-500">
            {activeRooms.length} rooms in use
          </span>
        </div>
        <button onClick={nextDay} className="p-2 hover:bg-gray-200 rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekend Notice */}
      {isWeekend ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
          <AlertCircle size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Classes on Weekends</p>
          <p className="text-sm mt-1">Classes are only held on weekdays (Mon-Fri)</p>
        </div>
      ) : (
        /* Schedule Grid */
        <div className="flex-1 overflow-auto relative">
          <div className="min-w-[700px]">
            {/* Period Header Row */}
            <div className="flex sticky top-0 bg-white z-20 border-b">
              <div className="w-16 shrink-0 p-2 bg-gray-50 border-r text-xs font-medium text-gray-500 sticky left-0 z-30">
                Room
              </div>
              {CLASS_ONLY_PERIODS.map(period => (
                <div key={period.period} className="flex-1 min-w-[55px] p-1 text-center border-r bg-gray-50">
                  <div className="text-xs font-medium text-gray-700">{period.label}</div>
                  <div className="text-[10px] text-gray-400">{period.startTime}</div>
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {activeRooms.map(room => {
              const roomSchedules = getScheduleForRoom(room.name);
              
              return (
                <div key={room.id} className="flex border-b hover:bg-gray-50/50">
                  {/* Room Name */}
                  <div className="w-16 shrink-0 p-2 border-r bg-white text-xs font-medium sticky left-0 z-10 flex items-center">
                    {room.name}
                  </div>
                  
                  {/* Period Cells */}
                  <div className="flex flex-1">
                    {CLASS_ONLY_PERIODS.map((period) => {
                      const schedule = roomSchedules.find(s => s.period === period.period);
                      
                      return (
                        <div 
                          key={period.period} 
                          className="flex-1 min-w-[55px] h-14 border-r border-gray-100 relative p-0.5"
                        >
                          {schedule && (
                            <div 
                              className="absolute inset-0.5 rounded text-white text-[10px] p-1 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: schedule.subjectColor }}
                            >
                              <div className="font-bold truncate">{schedule.student}</div>
                              <div className="opacity-80 truncate">{schedule.teacher}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Empty Rooms Section */}
            {activeRooms.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No rooms have schedules for this day.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 z-30">
        <Plus size={24} />
      </button>
    </div>
  );
}
