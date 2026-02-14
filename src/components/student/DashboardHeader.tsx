"use client";

import { Search } from "lucide-react";

interface DashboardHeaderProps {
  studentName: string;
  todayClasses: number;
  currentSession: string;
  className?: string;
  onSearchChange?: (query: string) => void;
  searchValue?: string;
}

export function DashboardHeader({
  studentName,
  todayClasses,
  currentSession,
  className = "",
  onSearchChange,
  searchValue = "",
}: DashboardHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 ${className}`}
    >
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {studentName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          You have{" "}
          <span className="font-semibold text-brand-primary">
            {todayClasses} classes
          </span>{" "}
          scheduled for today.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-end">
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
        <div className="text-left sm:text-right">
          <p className="text-sm font-medium text-muted-foreground">
            Current Session
          </p>
          <p className="text-xl font-bold text-foreground">{currentSession}</p>
        </div>
      </div>
    </div>
  );
}
