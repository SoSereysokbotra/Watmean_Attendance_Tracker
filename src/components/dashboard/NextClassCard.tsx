"use client";

import { Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface NextClassCardProps {
  className?: string;
  time: string;
  subject: string;
  room: string;
  professor: string;
  checkInPath: string;
  highlight?: boolean;
}

export function NextClassCard({
  className = "",
  time,
  subject,
  room,
  professor,
  checkInPath,
  highlight = false,
}: NextClassCardProps) {
  const router = useRouter();

  // Using theme-aware colors
  if (highlight) {
    return (
      <div
        className={`bg-brand-dark dark:bg-background border-2 border-brand-primary/30 dark:border-brand-primary/20 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer ${className}`}
        onClick={() => router.push(checkInPath)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-white/80 dark:text-foreground/90">
            <Clock size={20} className="text-brand-primary" />
            <span className="text-sm font-medium">Next Class • {time}</span>
          </div>
          <h3 className="text-2xl font-bold mb-1 text-white dark:text-foreground">
            {subject}
          </h3>
          <p className="text-white/70 dark:text-muted-foreground/90 text-sm">
            {room} • {professor}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary w-fit px-3 py-1.5 rounded-lg border border-brand-primary/20 dark:border-brand-primary/30 hover:bg-brand-primary/20 transition-colors">
            <MapPin size={14} /> Check In
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-brand-dark dark:bg-background border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all ${className}`}
      onClick={() => router.push(checkInPath)}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-white/70 dark:text-muted-foreground">
          <Clock size={20} />
          <span className="text-sm font-medium">Next Class • {time}</span>
        </div>
        <h3 className="text-2xl font-bold mb-1 text-white dark:text-foreground">
          {subject}
        </h3>
        <p className="text-white/70 dark:text-muted-foreground text-sm">
          {room} • {professor}
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary w-fit px-3 py-1.5 rounded-lg border border-brand-primary/20 dark:border-brand-primary/30 hover:bg-brand-primary/20 transition-colors">
          <MapPin size={14} /> Check In
        </div>
      </div>
    </div>
  );
}
