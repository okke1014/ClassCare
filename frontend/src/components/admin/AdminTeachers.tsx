"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserPlus, X, User, Hash, BookOpen } from "lucide-react";
import { MOCK_TEACHERS, MOCK_SUBJECTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type TeacherStatus = 'working' | 'vacation' | 'training' | 'resigned';

const STATUS_CONFIG: Record<TeacherStatus, { label: string; bgColor: string; textColor: string }> = {
  working: { label: 'Working', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  vacation: { label: 'Vacation', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  training: { label: 'Training', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  resigned: { label: 'Resigned', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
};

export function AdminTeachers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TeacherStatus | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    subjects: [] as string[],
    status: 'working' as TeacherStatus,
  });

  const filteredTeachers = MOCK_TEACHERS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusCount = (status: TeacherStatus) => 
    MOCK_TEACHERS.filter(t => t.status === status).length;

  return (
    <div className="h-full flex flex-col">
      {/* Search & Add - Fixed Header */}
      <div className="p-4 bg-white border-b shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search teachers..." 
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
        <div className="flex gap-1.5 mt-3 overflow-x-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={cn(
              "text-xs px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap",
              filterStatus === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All ({MOCK_TEACHERS.length})
          </button>
          {(Object.keys(STATUS_CONFIG) as TeacherStatus[]).map(status => {
            const config = STATUS_CONFIG[status];
            const count = getStatusCount(status);
            return (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "text-xs px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap",
                  filterStatus === status 
                    ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-1 ring-current` 
                    : `${config.bgColor} ${config.textColor} opacity-70 hover:opacity-100`
                )}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {filteredTeachers.map(teacher => {
            const statusConfig = STATUS_CONFIG[teacher.status as TeacherStatus];
            
            return (
              <div 
                key={teacher.id} 
                className={cn(
                  "flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
                  teacher.status === 'resigned' && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    {teacher.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{teacher.name}</h3>
                      <span className="text-[10px] text-gray-400">{teacher.teacherId}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.subjects.map((subject, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    statusConfig.bgColor,
                    statusConfig.textColor
                  )}>
                    {statusConfig.label}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                Add New Teacher
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter teacher name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Teacher ID <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.teacherId}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
                    placeholder="TCH-009"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    Subjects
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_SUBJECTS.map(subject => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          subjects: prev.subjects.includes(subject.name)
                            ? prev.subjects.filter(s => s !== subject.name)
                            : [...prev.subjects, subject.name],
                        }));
                      }}
                      className={cn(
                        "text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all border-2",
                        formData.subjects.includes(subject.name)
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as TeacherStatus[]).map(status => {
                    const config = STATUS_CONFIG[status];
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                        className={cn(
                          "py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center transition-all border-2",
                          formData.status === status
                            ? `${config.bgColor} ${config.textColor} border-current`
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('New teacher:', formData);
                  alert(`Teacher "${formData.name}" has been added.`);
                  setIsAddModalOpen(false);
                  setFormData({ name: '', teacherId: '', subjects: [], status: 'working' });
                }}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
