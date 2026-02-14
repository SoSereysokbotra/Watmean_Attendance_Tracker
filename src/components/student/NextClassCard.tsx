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
  isCheckedIn?: boolean;
}

export function NextClassCard({
  className = "",
  time,
  subject,
  room,
  professor,
  checkInPath,
  highlight = false,
  isCheckedIn = false,
}: NextClassCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isCheckedIn) {
      router.push(checkInPath);
    }
  };

  // Using theme-aware colors
  if (highlight) {
    return (
      <div
        className={`bg-brand-dark dark:bg-background border-2 border-brand-primary/30 dark:border-brand-primary/20 p-6 rounded-2xl shadow-lg relative overflow-hidden group ${
          isCheckedIn ? "cursor-default" : "cursor-pointer"
        } ${className}`}
        onClick={handleClick}
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
          <div
            className={`mt-6 flex items-center gap-2 text-sm font-medium w-fit px-3 py-1.5 rounded-lg border transition-colors ${
              isCheckedIn
                ? "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30"
                : "bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary border-brand-primary/20 dark:border-brand-primary/30 hover:bg-brand-primary/20"
            }`}
          >
            {isCheckedIn ? <MapPin size={14} /> : <MapPin size={14} />}
            {isCheckedIn ? "Checked In" : "Check In"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-brand-dark dark:bg-background border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${
        isCheckedIn ? "cursor-default" : "cursor-pointer"
      } ${className}`}
      onClick={handleClick}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-white/70 dark:text-muted-foreground">
          <Clock size={20} />
          <span className="text-sm font-medium">Next Class • {time}</span>
        </div>
        <h3 className="text-2xl font-bold mb-1 text-white dark:text-foreground truncate">
          {subject}
        </h3>
        <p className="text-white/70 dark:text-muted-foreground text-sm truncate">
          {room} • {professor}
        </p>
        <div
          className={`mt-6 flex items-center gap-2 text-sm font-medium w-fit px-3 py-1.5 rounded-lg border transition-colors ${
            isCheckedIn
              ? "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30"
              : "bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary border-brand-primary/20 dark:border-brand-primary/30 hover:bg-brand-primary/20"
          }`}
        >
          {isCheckedIn ? <MapPin size={14} /> : <MapPin size={14} />}
          {isCheckedIn ? "Checked In" : "Check In"}
        </div>
      </div>
    </div>
  );
}
