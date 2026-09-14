"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { StudentNav } from "@/components/StudentNav";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
        // Uncomment for real auth
        // router.push("/");
        
        // Mock user for development if not logged in
        setUser({ username: "Guest" });
    }
  }, [router]);

  if (!user) {
    return (
      <div className="h-screen flex flex-col animate-pulse">
        <AppHeader right={<div className="w-8 h-8 rounded-full bg-gray-200" />} />
        <div className="px-4 py-3">
          <div className="h-5 w-40 rounded bg-gray-200" />
        </div>
        <div className="px-3 pb-3 grid grid-cols-7 gap-y-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-7 h-7 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="flex-1 bg-gray-50 p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white border" />
          ))}
        </div>
        <div className="h-16 border-t bg-white shrink-0" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <AppHeader
        right={
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
            {user.username[0].toUpperCase()}
          </div>
        }
      />

      <div className="flex-1 overflow-hidden">
        <CalendarWidget />
      </div>

      <StudentNav />
    </div>
  );
}
