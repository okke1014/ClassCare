"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarWidget } from "@/components/CalendarWidget";

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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <Image
          src="/images/ev-system-logo.png"
          alt="EV Academy"
          width={120}
          height={32}
          className="h-8 w-auto"
          priority
        />
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
            {user.username[0].toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CalendarWidget />
      </div>
    </div>
  );
}

