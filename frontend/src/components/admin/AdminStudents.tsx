"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MoreHorizontal, UserPlus, GraduationCap, BookOpen, X, User, Hash, Edit, Calendar, Upload, FileSpreadsheet, Image } from "lucide-react";
import { MOCK_STUDENTS, CLASS_PERIODS, MOCK_TEACHERS, MOCK_ROOMS, MOCK_SUBJECTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type StudentStatus = 'studying' | 'graduated';

const STATUS_CONFIG: Record<StudentStatus, { label: string; bgColor: string; textColor: string; icon: typeof BookOpen }> = {
  studying: { label: 'Studying', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: BookOpen },
  graduated: { label: 'Graduated', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: GraduationCap },
};

// Get class periods only (numbered)
const SCHEDULE_PERIODS = CLASS_PERIODS.filter(p => typeof p.period === 'number' || ['LUNCH', 'DINNER', 'SELF-STUDY'].includes(String(p.period)));

interface StudentFormData {
  name: string;
  studentId: string;
  status: StudentStatus;
}

interface ScheduleEntry {
  period: string | number;
  room: string;
  subject: string;
  teacher: string;
}

// ==================== Add Student Modal ====================
interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
}

function AddStudentModal({ isOpen, onClose, onSubmit }: AddStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    studentId: '',
    status: 'studying',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', studentId: '', status: 'studying' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserPlus size={20} className="text-primary" />
            Add New Student
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Enter student name" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Student ID <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text" name="studentId" value={formData.studentId} onChange={handleChange}
                placeholder="STU-2026-006" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex gap-2">
              {(Object.keys(STATUS_CONFIG) as StudentStatus[]).map(status => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                return (
                  <button key={status} type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border-2",
                      formData.status === status ? `${config.bgColor} ${config.textColor} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <Icon size={14} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Schedule Registration Modal ====================
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: { name: string; studentId: string } | null;
}

function ScheduleModal({ isOpen, onClose, student }: ScheduleModalProps) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(() => 
    SCHEDULE_PERIODS.map(p => ({
      period: p.period,
      room: '',
      subject: '',
      teacher: '',
    }))
  );
  const [uploadMode, setUploadMode] = useState<'manual' | 'file'>('manual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateScheduleEntry = (index: number, field: keyof ScheduleEntry, value: string) => {
    setSchedule(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Parse Excel/Image file
      alert(`File "${file.name}" has been uploaded.\nIn production, the file will be parsed to auto-fill the schedule.`);
    }
  };

  const handleSubmit = () => {
    console.log('Schedule for', student?.name, ':', schedule);
    alert(`Schedule for ${student?.name} has been registered.`);
    onClose();
  };

  if (!isOpen || !student) return null;

  const getPeriodLabel = (period: string | number) => {
    if (typeof period === 'number') return `${period}`;
    return period;
  };

  const getPeriodTime = (period: string | number) => {
    const p = CLASS_PERIODS.find(cp => cp.period === period);
    return p ? `${p.startTime}-${p.endTime}` : '';
  };

  const isBreakPeriod = (period: string | number) => {
    return ['LUNCH', 'DINNER', 'SENTENCE', 'SELF-STUDY'].includes(String(period));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-blue-900">
              <Calendar size={20} />
              Schedule Registration
            </h2>
            <p className="text-sm text-blue-700 mt-0.5">{student.name} ({student.studentId})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Upload Mode Toggle */}
        <div className="p-3 border-b bg-gray-50 flex gap-2">
          <button
            onClick={() => setUploadMode('manual')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              uploadMode === 'manual' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <Edit size={14} />
            Manual Entry
          </button>
          <button
            onClick={() => setUploadMode('file')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              uploadMode === 'file' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <Upload size={14} />
            File Upload
          </button>
        </div>

        {uploadMode === 'file' ? (
          /* File Upload Mode */
          <div className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <FileSpreadsheet size={40} className="text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Excel File</span>
                <span className="text-xs text-gray-500 mt-1">.xlsx, .xls, .csv</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Image size={40} className="text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Image File</span>
                <span className="text-xs text-gray-500 mt-1">.jpg, .png, .pdf</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Upload a schedule image or Excel file to auto-fill the timetable
            </p>
          </div>
        ) : (
          /* Manual Entry Mode */
          <div className="overflow-y-auto max-h-[50vh]">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-2 px-2 text-left font-medium text-gray-600 w-16">Period</th>
                  <th className="py-2 px-2 text-left font-medium text-gray-600 w-16">Time</th>
                  <th className="py-2 px-2 text-left font-medium text-gray-600">Room</th>
                  <th className="py-2 px-2 text-left font-medium text-gray-600">Subject</th>
                  <th className="py-2 px-2 text-left font-medium text-gray-600">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry, index) => {
                  const isBreak = isBreakPeriod(entry.period);
                  return (
                    <tr key={index} className={cn(
                      "border-b",
                      isBreak ? "bg-orange-50" : "hover:bg-gray-50"
                    )}>
                      <td className="py-1.5 px-2">
                        <span className={cn(
                          "text-xs font-bold px-1.5 py-0.5 rounded",
                          isBreak ? "bg-orange-200 text-orange-800" : "bg-blue-100 text-blue-700"
                        )}>
                          {getPeriodLabel(entry.period)}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[10px] text-gray-500">
                        {getPeriodTime(entry.period)}
                      </td>
                      <td className="py-1.5 px-1">
                        {!isBreak && (
                          <select
                            value={entry.room}
                            onChange={(e) => updateScheduleEntry(index, 'room', e.target.value)}
                            className="w-full text-xs py-1 px-1.5 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                          >
                            <option value="">-</option>
                            {MOCK_ROOMS.slice(0, 10).map(r => (
                              <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="py-1.5 px-1">
                        {!isBreak ? (
                          <select
                            value={entry.subject}
                            onChange={(e) => updateScheduleEntry(index, 'subject', e.target.value)}
                            className="w-full text-xs py-1 px-1.5 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                          >
                            <option value="">-</option>
                            {MOCK_SUBJECTS.map(s => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-orange-600 font-medium">
                            {entry.period === 'LUNCH' ? 'Lunch Break' : 
                             entry.period === 'DINNER' ? 'Dinner Break' : 
                             entry.period === 'SELF-STUDY' ? 'Self Study' : String(entry.period)}
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-1">
                        {!isBreak && (
                          <select
                            value={entry.teacher}
                            onChange={(e) => updateScheduleEntry(index, 'teacher', e.target.value)}
                            className="w-full text-xs py-1 px-1.5 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                          >
                            <option value="">-</option>
                            {MOCK_TEACHERS.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Edit Student Modal ====================
interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: { id: number; name: string; studentId: string; status: string } | null;
}

function EditStudentModal({ isOpen, onClose, student }: EditStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    studentId: '',
    status: 'studying',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        studentId: student.studentId,
        status: student.status as StudentStatus,
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Updated student:', formData);
    alert(`Student information has been updated.`);
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Edit size={20} className="text-primary" />
            Edit Student
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Student ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text" name="studentId" value={formData.studentId} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex gap-2">
              {(Object.keys(STATUS_CONFIG) as StudentStatus[]).map(status => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                return (
                  <button key={status} type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border-2",
                      formData.status === status ? `${config.bgColor} ${config.textColor} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <Icon size={14} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Dropdown Menu ====================
interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSchedule: () => void;
  position: { top: number; left: number };
}

function DropdownMenu({ isOpen, onClose, onEdit, onSchedule, position }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border z-50 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <button
        onClick={() => { onEdit(); onClose(); }}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
      >
        <Edit size={16} className="text-gray-500" />
        Edit Info
      </button>
      <button
        onClick={() => { onSchedule(); onClose(); }}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
      >
        <Calendar size={16} className="text-blue-500" />
        Register Schedule
      </button>
    </div>
  );
}

// ==================== Main Component ====================
export function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StudentStatus | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [dropdownState, setDropdownState] = useState<{ isOpen: boolean; position: { top: number; left: number } }>({
    isOpen: false,
    position: { top: 0, left: 0 },
  });

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusCount = (status: StudentStatus) => 
    MOCK_STUDENTS.filter(s => s.status === status).length;

  const handleMoreClick = (e: React.MouseEvent, student: typeof MOCK_STUDENTS[0]) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectedStudent(student);
    setDropdownState({
      isOpen: true,
      position: { top: rect.bottom + 4, left: rect.left - 120 },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search & Add - Fixed Header */}
      <div className="p-4 bg-white border-b shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shrink-0 hover:bg-primary/90 transition-colors"
          >
            <UserPlus size={16} />
            Add
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => setFilterStatus('all')}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-colors",
              filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All ({MOCK_STUDENTS.length})
          </button>
          {(Object.keys(STATUS_CONFIG) as StudentStatus[]).map(status => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            return (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1",
                  filterStatus === status 
                    ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-1 ring-current` 
                    : `${config.bgColor} ${config.textColor} opacity-70 hover:opacity-100`
                )}
              >
                <Icon size={12} />
                {config.label} ({getStatusCount(status)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {filteredStudents.map(student => {
            const statusConfig = STATUS_CONFIG[student.status as StudentStatus];
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={student.id} 
                className={cn(
                  "flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
                  student.status === 'graduated' && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{student.name}</h3>
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                    statusConfig.bgColor,
                    statusConfig.textColor
                  )}>
                    <StatusIcon size={10} />
                    {statusConfig.label}
                  </span>
                  <button 
                    onClick={(e) => handleMoreClick(e, student)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu
        isOpen={dropdownState.isOpen}
        onClose={() => setDropdownState(prev => ({ ...prev, isOpen: false }))}
        onEdit={() => setIsEditModalOpen(true)}
        onSchedule={() => setIsScheduleModalOpen(true)}
        position={dropdownState.position}
      />

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          console.log('New student:', data);
          alert(`Student "${data.name}" has been added.`);
        }}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
