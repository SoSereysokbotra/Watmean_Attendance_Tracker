"use client";

import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  highlight?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className = "",
  highlight = false,
}: StatsCardProps) {
  const defaultIcon = <TrendingUp size={24} />;

  return (
    <div
      className={`${highlight ? "bg-brand-dark text-primary-foreground" : "bg-card text-foreground"} p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 ${highlight ? "bg-primary-foreground/10 text-primary-foreground" : "bg-brand-primary/10 text-brand-primary"} rounded-xl`}
        >
          {icon || defaultIcon}
        </div>
        {trend && !highlight && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              trend.isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p
        className={`text-sm font-medium ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {title}
      </p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}
