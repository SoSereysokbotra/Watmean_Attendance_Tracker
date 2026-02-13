"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconColorClass?: string;
  bgColorClass?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColorClass = "text-brand-primary",
  bgColorClass = "bg-brand-primary/10",
}: StatsCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColorClass} ${iconColorClass}`}>
          <Icon size={20} className="sm:h-6 sm:w-6" />
        </div>
        <span className="text-sm font-medium text-emerald-600">{change}</span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
        {value}
      </h3>
      <p className="text-muted-foreground text-sm mt-1">{title}</p>
    </div>
  );
}
