"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdminSchedules } from "@/components/admin/AdminSchedules";
import { AdminStudents } from "@/components/admin/AdminStudents";
import { AdminTeachers } from "@/components/admin/AdminTeachers";
import { AdminClassrooms } from "@/components/admin/AdminClassrooms";
import { AdminSubjects } from "@/components/admin/AdminSubjects";
import { cn } from "@/lib/utils";

type Tab = "schedules" | "students" | "teachers" | "subjects" | "classrooms";

const TABS: { id: Tab; label: string }[] = [
  { id: "schedules", label: "Schedules" },
  { id: "students", label: "Students" },
  { id: "teachers", label: "Teachers" },
  { id: "subjects", label: "Subjects" },
  { id: "classrooms", label: "Rooms" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("schedules");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader title="Admin Dashboard" />

      <div className="bg-white border-b flex overflow-x-auto shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-[60px]",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
