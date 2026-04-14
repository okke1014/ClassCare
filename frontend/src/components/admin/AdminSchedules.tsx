"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, AlertCircle, X } from "lucide-react";
import { CLASS_PERIODS, MOCK_ROOMS, MOCK_TEACHERS, MOCK_SUBJECTS, MOCK_STUDENTS, generateRoomSchedules, RoomSchedule } from "@/lib/mockData";

// Get class periods only (exclude breaks for grid display)
const CLASS_ONLY_PERIODS = CLASS_PERIODS.filter(
  p => typeof p.period === 'number'
) as { period: number; startTime: string; endTime: string; label: string }[];

const activeRoomsList = MOCK_ROOMS.filter(r => r.status === 'active');
const activeTeachers = MOCK_TEACHERS.filter(t => t.status === 'working');
const activeStudents = MOCK_STUDENTS.filter(s => s.status === 'studying');

export function AdminSchedules() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 5)); // Jan 5, 2026 (Monday)
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    teacher: '',
    subject: '',
    room: '',
    period: '',
  });

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
      <button
        onClick={() => setShowAddDialog(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 z-30"
      >
        <Plus size={24} />
      </button>

      {/* Add Schedule Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setShowAddDialog(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                Add Schedule
              </h2>
              <button
                onClick={() => setShowAddDialog(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Date (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Date</label>
                <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </div>
              </div>

              {/* Student */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Student</label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData(prev => ({ ...prev, student: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                >
                  <option value="">Select student</option>
                  {activeStudents.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                >
                  <option value="">Select subject</option>
                  {MOCK_SUBJECTS.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Teacher</label>
                <select
                  value={formData.teacher}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                >
                  <option value="">Select teacher</option>
                  {activeTeachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Room</label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                >
                  <option value="">Select room</option>
                  {activeRoomsList.map(r => (
                    <option key={r.id} value={r.name}>{r.name} ({r.floor})</option>
                  ))}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                >
                  <option value="">Select period</option>
                  {CLASS_ONLY_PERIODS.map(p => (
                    <option key={p.period} value={p.period}>
                      {p.label} ({p.startTime} - {p.endTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setFormData({ student: '', teacher: '', subject: '', room: '', period: '' });
                }}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
