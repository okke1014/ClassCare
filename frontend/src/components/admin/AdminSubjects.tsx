"use client";

import { Plus, BookOpen, Clock, Users } from "lucide-react";
import { MOCK_SUBJECTS } from "@/lib/mockData";

export function AdminSubjects() {
  // 모든 수업은 45분
  const CLASS_DURATION = 45;

  return (
    <div className="h-full overflow-y-auto">
      {/* Add Button */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
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
    </div>
  );
}
