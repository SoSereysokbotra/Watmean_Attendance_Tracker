"use client";

import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  teacherName: string;
  initials?: string;
}

export function DashboardHeader({
  teacherName,
  initials = "PD",
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-dark text-foreground">
          Welcome back, {teacherName} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your automated geofenced attendance.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-background border border-border shadow-sm hover:bg-muted transition-colors">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"></span>
        </button>
        <div className="w-12 h-12 rounded-xl bg-foreground text-background shadow-lg flex items-center justify-center font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}
