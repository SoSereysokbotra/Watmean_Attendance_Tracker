"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ScheduleItemProps {
  time: string;
  period: "AM" | "PM";
  title: string;
  location: string;
  status: "present" | "upcoming" | "absent" | "late";
  statusText: string;
  showCheckIn?: boolean;
  checkInPath?: string;
  className?: string;
}

export function ScheduleItem({
  time,
  period,
  title,
  location,
  status,
  statusText,
  showCheckIn = false,
  checkInPath = "/checkin",
  className = "",
}: ScheduleItemProps) {
  const statusConfig = {
    present: {
      dotColor: "bg-emerald-500",
      statusColor:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    upcoming: {
      dotColor: "bg-border",
      statusColor:
        "border border-border text-muted-foreground hover:border-brand-primary hover:text-brand-primary",
    },
    absent: {
      dotColor: "bg-rose-500",
      statusColor:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    },
    late: {
      dotColor: "bg-amber-500",
      statusColor:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-4 p-4 ${status === "present" ? "bg-muted" : "hover:bg-muted/50"} rounded-xl transition-colors ${className}`}
    >
      <div className="w-16 text-center">
        <span className="block text-sm font-bold text-foreground">{time}</span>
        <span className="block text-xs text-muted-foreground">{period}</span>
      </div>
      <div className={`h-10 w-1 ${config.dotColor} rounded-full`}></div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-foreground truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{location}</p>
      </div>
      {showCheckIn ? (
        <Link
          href={checkInPath}
          className={`ml-auto px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${config.statusColor}`}
        >
          {statusText}
        </Link>
      ) : (
        <span
          className={`ml-auto px-3 py-1 text-xs font-bold rounded-full ${config.statusColor}`}
        >
          {statusText}
        </span>
      )}
    </div>
  );
}
