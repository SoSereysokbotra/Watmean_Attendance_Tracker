"use client";

import { Bell, Search } from "lucide-react";

interface DashboardHeaderProps {
  teacherName: string;
  initials?: string;
  onSearchChange?: (query: string) => void;
  searchValue?: string;
}

export function DashboardHeader({
  teacherName,
  initials = "PD",
  onSearchChange,
  searchValue = "",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {teacherName} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your automated geofenced attendance.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
          />
        </div>
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
