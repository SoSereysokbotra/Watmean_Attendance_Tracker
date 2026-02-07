/**
 * Session statistics cards component
 * Displays session status, attendance percentage, present/absent counts
 */

import { Timer, Users, AlertCircle } from "lucide-react";
import { AttendanceStats } from "@/hooks/useAttendance";
import { Session } from "@/types";

interface SessionStatsProps {
  session: Session | null;
  stats: AttendanceStats;
  targetPercentage?: number;
}

export function SessionStats({
  session,
  stats,
  targetPercentage = 90,
}: SessionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Status Card */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
          <Timer size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Status
          </p>
          <p className="font-bold text-foreground capitalize">
            {session?.status || "Active"}
          </p>
          {session && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              {session.startTime} - {session.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Percentage Card */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Simple ring visualization */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted/20"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-brand-primary"
              strokeDasharray={`${stats.attendancePercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          <span className="absolute text-xs font-bold text-foreground">
            {stats.attendancePercentage}%
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Attendance Rate
          </p>
          <p className="text-xs text-muted-foreground">
            Target: {targetPercentage}%
          </p>
        </div>
      </div>

      {/* Present Count */}
      <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
            Present
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stats.presentCount}
          </p>
        </div>
      </div>

      {/* Absent Count */}
      <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
            Absent
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stats.absentCount}
          </p>
        </div>
      </div>
    </div>
  );
}
