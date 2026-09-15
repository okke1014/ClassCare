"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookMarked, Calendar, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Schedule", icon: Calendar },
  { href: "/student/growth-report", label: "Growth Report", icon: TrendingUp },
  { href: "/student/vocab", label: "Vocab Books", icon: BookMarked },
  { href: "/student/my", label: "My Info", icon: User },
];

export function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="min-h-16 pb-[env(safe-area-inset-bottom)] border-t bg-white/95 backdrop-blur-sm shadow-[0_-2px_8px_rgba(0,0,0,0.04)] flex items-stretch shrink-0">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[11px] sm:text-xs font-medium transition-colors active:bg-gray-50",
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
