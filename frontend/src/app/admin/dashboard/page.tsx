"use client";

import { useState } from "react";
import { AdminSchedules } from "@/components/admin/AdminSchedules";
import { AdminStudents } from "@/components/admin/AdminStudents";
import { AdminTeachers } from "@/components/admin/AdminTeachers";
import { AdminClassrooms } from "@/components/admin/AdminClassrooms";
import { AdminSubjects } from "@/components/admin/AdminSubjects";
import { cn } from "@/lib/utils";

type Tab = "schedules" | "students" | "teachers" | "subjects" | "classrooms";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("schedules");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shrink-0">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Top Navigation Tabs */}
      <div className="bg-white border-b flex overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab("schedules")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
            activeTab === "schedules" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Schedules
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
            activeTab === "students" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
            activeTab === "teachers" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("subjects")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
            activeTab === "subjects" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Subjects
        </button>
        <button
          onClick={() => setActiveTab("classrooms")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
            activeTab === "classrooms" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Rooms
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "schedules" && <AdminSchedules />}
        {activeTab === "students" && <AdminStudents />}
        {activeTab === "teachers" && <AdminTeachers />}
        {activeTab === "subjects" && <AdminSubjects />}
        {activeTab === "classrooms" && <AdminClassrooms />}
      </div>
    </div>
  );
}
