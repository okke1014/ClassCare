import { CalendarEvent } from './dateUtils';

// Class period definitions (45 min each)
export const CLASS_PERIODS = [
  { period: 1, startTime: '08:00', endTime: '08:45', label: '1st' },
  { period: 2, startTime: '08:50', endTime: '09:35', label: '2nd' },
  { period: 3, startTime: '09:40', endTime: '10:25', label: '3rd' },
  { period: 4, startTime: '10:30', endTime: '11:15', label: '4th' },
  { period: 5, startTime: '11:20', endTime: '12:05', label: '5th' },
  { period: 'LUNCH', startTime: '12:05', endTime: '13:05', label: 'LUNCH' },
  { period: 6, startTime: '13:05', endTime: '13:50', label: '6th' },
  { period: 7, startTime: '13:55', endTime: '14:40', label: '7th' },
  { period: 8, startTime: '14:45', endTime: '15:30', label: '8th' },
  { period: 9, startTime: '15:35', endTime: '16:20', label: '9th' },
  { period: 10, startTime: '16:25', endTime: '17:10', label: '10th' },
  { period: 11, startTime: '17:15', endTime: '18:00', label: '11th' },
  { period: 'DINNER', startTime: '18:00', endTime: '18:50', label: 'DINNER' },
  { period: 'SENTENCE', startTime: '18:50', endTime: '20:00', label: 'SENTENCE' },
  { period: 'SELF-STUDY', startTime: '20:00', endTime: '22:00', label: 'SELF-STUDY' },
] as const;

// Teachers
// status: 'working' = 정상근무, 'vacation' = 휴가 중, 'training' = 교육 중, 'resigned' = 퇴사
export const MOCK_TEACHERS = [
  { id: 1, teacherId: 'TCH-001', name: 'Izay', subjects: ['Listening', 'Speaking'], status: 'working' },
  { id: 2, teacherId: 'TCH-002', name: 'Nesa', subjects: ['Speaking', 'Grammar'], status: 'working' },
  { id: 3, teacherId: 'TCH-003', name: 'Eyen', subjects: ['Reading', 'Writing'], status: 'vacation' },
  { id: 4, teacherId: 'TCH-004', name: 'Camille', subjects: ['Writing', 'Grammar'], status: 'working' },
  { id: 5, teacherId: 'TCH-005', name: 'Charen', subjects: ['Grammar', 'Reading'], status: 'training' },
  { id: 6, teacherId: 'TCH-006', name: 'Andy', subjects: ['Activity Class', 'Speaking'], status: 'working' },
  { id: 7, teacherId: 'TCH-007', name: 'Brian', subjects: ['Activity Class', 'Listening'], status: 'working' },
  { id: 8, teacherId: 'TCH-008', name: 'Issa', subjects: ['Activity Class', 'Voca'], status: 'resigned' },
];

// Subjects (all 45 min)
export const MOCK_SUBJECTS = [
  { id: 1, name: 'Listening', code: 'LIST', duration: 45, color: '#3B82F6' },
  { id: 2, name: 'Speaking', code: 'SPEAK', duration: 45, color: '#10B981' },
  { id: 3, name: 'Reading', code: 'READ', duration: 45, color: '#F59E0B' },
  { id: 4, name: 'Writing', code: 'WRITE', duration: 45, color: '#EF4444' },
  { id: 5, name: 'Grammar', code: 'GRAM', duration: 45, color: '#8B5CF6' },
  { id: 6, name: 'Activity Class', code: 'ACT', duration: 45, color: '#EC4899' },
  { id: 7, name: 'Self-Study', code: 'SELF', duration: 45, color: '#6B7280' },
  { id: 8, name: 'Voca', code: 'VOCA', duration: 45, color: '#06B6D4' },
];

// Rooms (1:1 rooms like 301 H, 304 D, etc.)
// status: 'active' = 사용 가능, 'maintenance' = 수리/점검 중
export const MOCK_ROOMS = [
  { id: 1, name: '104 B', floor: '1F', status: 'active' },
  { id: 2, name: '207 B', floor: '2F', status: 'active' },
  { id: 3, name: '208 E', floor: '2F', status: 'maintenance' }, // 수리 중
  { id: 4, name: '301 H', floor: '3F', status: 'active' },
  { id: 5, name: '304 D', floor: '3F', status: 'active' },
  { id: 6, name: '310 A', floor: '3F', status: 'active' },
  ...Array.from({ length: 44 }, (_, i) => ({
    id: i + 7,
    name: `${Math.floor(i / 10) + 1}${String((i % 10) + 1).padStart(2, '0')} ${String.fromCharCode(65 + (i % 8))}`,
    floor: `${Math.floor(i / 10) + 1}F`,
    status: i % 15 === 0 ? 'maintenance' : 'active' as const, // 약 7%가 수리 중
  })),
];

// Students
// status: 'studying' = 공부중, 'graduated' = 졸업
export const MOCK_STUDENTS = [
  { id: 1, studentId: 'STU-2026-001', name: 'Janeyang', email: 'janeyang@example.com', status: 'studying' },
  { id: 2, studentId: 'STU-2026-002', name: 'Kim Min-ji', email: 'minji@example.com', status: 'studying' },
  { id: 3, studentId: 'STU-2026-003', name: 'Lee Jun-ho', email: 'junho@example.com', status: 'graduated' },
  { id: 4, studentId: 'STU-2026-004', name: 'Park Soo-yeon', email: 'sooyeon@example.com', status: 'studying' },
  { id: 5, studentId: 'STU-2026-005', name: 'Choi Dong-wook', email: 'dongwook@example.com', status: 'studying' },
];

// Student daily schedule template (Janeyang's schedule from image)
export interface DailyScheduleItem {
  period: number | string;
  startTime: string;
  endTime: string;
  room?: string;
  subject?: string;
  teacher?: string;
  isBreak?: boolean;
}

export const JANEYANG_SCHEDULE: DailyScheduleItem[] = [
  { period: 1, startTime: '08:00', endTime: '08:45', room: '304 D', subject: 'Listening', teacher: 'Izay' },
  { period: 2, startTime: '08:50', endTime: '09:35', room: '301 H', subject: 'Speaking', teacher: 'Nesa' },
  { period: 3, startTime: '09:40', endTime: '10:25', room: '208 E', subject: 'Reading', teacher: 'Eyen' },
  { period: 4, startTime: '10:30', endTime: '11:15', room: '310 A', subject: 'Writing', teacher: 'Camille' },
  { period: 5, startTime: '11:20', endTime: '12:05' }, // Free period
  { period: 'LUNCH', startTime: '12:05', endTime: '13:05', isBreak: true },
  { period: 6, startTime: '13:05', endTime: '13:50', room: '207 B', subject: 'Grammar', teacher: 'Charen' },
  { period: 7, startTime: '13:55', endTime: '14:40', room: '104 B', subject: 'Activity Class', teacher: 'Andy' },
  { period: 8, startTime: '14:45', endTime: '15:30', room: '104 B', subject: 'Activity Class', teacher: 'Andy' },
  { period: 9, startTime: '15:35', endTime: '16:20' }, // Free period
  { period: 10, startTime: '16:25', endTime: '17:10', subject: 'Self-Study' },
  { period: 11, startTime: '17:15', endTime: '18:00' }, // Free period
  { period: 'DINNER', startTime: '18:00', endTime: '18:50', isBreak: true },
  { period: 'SENTENCE', startTime: '18:50', endTime: '20:00' },
  { period: 'SELF-STUDY', startTime: '20:00', endTime: '22:00', subject: 'Self-Study' },
];

// Helper function to generate weekday dates for a given week
const getWeekdayDates = (baseDate: Date): Date[] => {
  const dates: Date[] = [];
  const dayOfWeek = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  for (let i = 0; i < 5; i++) { // Mon to Fri
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Generate calendar events for Janeyang (weekdays only, same schedule every day)
const generateCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const baseDate = new Date(2026, 0, 5); // January 5, 2026 (Monday)
  
  // Generate for 4 weeks
  for (let week = 0; week < 4; week++) {
    const weekStart = new Date(baseDate);
    weekStart.setDate(baseDate.getDate() + (week * 7));
    const weekdays = getWeekdayDates(weekStart);
    
    weekdays.forEach((date, dayIndex) => {
      JANEYANG_SCHEDULE.forEach((item, itemIndex) => {
        // Only include numbered periods (1-11), exclude breaks and special periods like SELF-STUDY
        if (item.subject && !item.isBreak && typeof item.period === 'number') {
          events.push({
            id: `${week}-${dayIndex}-${itemIndex}`,
            title: item.subject,
            date: new Date(date),
            startTime: item.startTime,
            endTime: item.endTime,
            type: 'class',
            status: date < new Date() ? 'completed' : 'pending',
            classroom: item.room || '',
            teacher: item.teacher || '',
          });
        }
      });
    });
  }
  
  return events;
};

export const MOCK_EVENTS: CalendarEvent[] = generateCalendarEvents();

// Room-based schedule data for admin view
export interface RoomSchedule {
  id: number;
  roomId: number;
  roomName: string;
  period: number;
  startTime: string;
  endTime: string;
  student: string;
  teacher: string;
  subject: string;
  subjectColor: string;
}

// Generate room-based schedules from student schedules
export const generateRoomSchedules = (date: Date): RoomSchedule[] => {
  const dayOfWeek = date.getDay();
  
  // No classes on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [];
  }
  
  const schedules: RoomSchedule[] = [];
  let id = 1;
  
  // Janeyang's schedule
  JANEYANG_SCHEDULE.forEach((item) => {
    if (item.room && item.subject && !item.isBreak && typeof item.period === 'number') {
      const subject = MOCK_SUBJECTS.find(s => s.name === item.subject);
      schedules.push({
        id: id++,
        roomId: MOCK_ROOMS.find(r => r.name === item.room)?.id || 1,
        roomName: item.room,
        period: item.period,
        startTime: item.startTime,
        endTime: item.endTime,
        student: 'Janeyang',
        teacher: item.teacher || '',
        subject: item.subject,
        subjectColor: subject?.color || '#3B82F6',
      });
    }
  });
  
  // Add some other students' schedules to other rooms
  const otherStudents = ['Kim Min-ji', 'Lee Jun-ho', 'Park Soo-yeon', 'Choi Dong-wook'];
  const unusedRooms = MOCK_ROOMS.filter(r => !['104 B', '207 B', '208 E', '301 H', '304 D', '310 A'].includes(r.name)).slice(0, 20);
  
  otherStudents.forEach((student, studentIdx) => {
    unusedRooms.slice(studentIdx * 5, (studentIdx + 1) * 5).forEach((room, roomIdx) => {
      const periods = [1, 2, 3, 6, 7].slice(0, 3 + (studentIdx % 2));
      periods.forEach((period) => {
        const periodInfo = CLASS_PERIODS.find(p => p.period === period);
        if (periodInfo && typeof periodInfo.period === 'number') {
          const subjectIdx = (studentIdx + period) % MOCK_SUBJECTS.length;
          const subject = MOCK_SUBJECTS[subjectIdx];
          schedules.push({
            id: id++,
            roomId: room.id,
            roomName: room.name,
            period: periodInfo.period,
            startTime: periodInfo.startTime,
            endTime: periodInfo.endTime,
            student,
            teacher: MOCK_TEACHERS[(studentIdx + roomIdx) % MOCK_TEACHERS.length].name,
            subject: subject.name,
            subjectColor: subject.color,
          });
        }
      });
    });
  });
  
  return schedules;
};
