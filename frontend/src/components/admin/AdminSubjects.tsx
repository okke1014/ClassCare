"use client";

import { useState } from "react";
import { Plus, BookOpen, Clock, Users, X, Hash } from "lucide-react";
import { MOCK_SUBJECTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#6B7280', '#06B6D4', '#F97316', '#14B8A6',
];

export function AdminSubjects() {
  const CLASS_DURATION = 45;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: PRESET_COLORS[0],
  });

  return (
    <div className="h-full overflow-y-auto">
      {/* Add Button */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700 text-sm">
          <Clock className="w-4 h-4" />
          <span>All classes are <strong>{CLASS_DURATION} minutes</strong> (weekdays only)</span>
        </div>
      </div>

      {/* Subjects List */}
      <div className="divide-y mt-4">
        {MOCK_SUBJECTS.map((subject) => (
          <div
            key={subject.id}
            className="p-4 bg-white hover:bg-gray-50 transition-colors flex items-center gap-4"
          >
            {/* Color indicator */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: subject.color + "20" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
            </div>

            {/* Subject info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">{subject.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full shrink-0">
                  {subject.code}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {CLASS_DURATION} min
                </span>
              </div>
            </div>

            {/* Color dot */}
            <div 
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: subject.color }}
            />
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Add New Subject
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Subject Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter subject name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Subject Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SPEAK"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Duration
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {CLASS_DURATION} minutes (fixed)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={cn(
                        "w-9 h-9 rounded-lg transition-all border-2",
                        formData.color === color ? "border-gray-800 scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.color }} />
                  <span className="text-xs text-gray-500">{formData.color}</span>
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
                  console.log('New subject:', formData);
                  alert(`Subject "${formData.name}" has been added.`);
                  setIsAddModalOpen(false);
                  setFormData({ name: '', code: '', color: PRESET_COLORS[0] });
                }}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
