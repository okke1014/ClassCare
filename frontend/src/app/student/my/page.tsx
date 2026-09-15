"use client";

import { User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StudentNav } from "@/components/StudentNav";
import { EmptyState } from "@/components/EmptyState";

export default function StudentMyPage() {
  return (
    <div className="h-dvh flex flex-col">
      <AppHeader title="My Info" />

      <div className="flex-1 overflow-y-auto bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon={User}
          title="Coming soon"
          description="You'll be able to view and edit your profile information here."
        />
      </div>

      <StudentNav />
    </div>
  );
}
