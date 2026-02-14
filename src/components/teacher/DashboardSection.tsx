"use client";

import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function DashboardSection({
  title,
  children,
  className = "",
  action,
}: DashboardSectionProps) {
  return (
    <div
      className={`bg-card rounded-3xl border border-border p-4 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
