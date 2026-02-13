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
  const formatTimeRange = () => {
    if (!session?.startTime || !session?.endTime) return null;
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return null;

    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const timeRange = formatTimeRange();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Status Card */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
          <Timer size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Status
          </p>
          <p className="font-bold text-foreground capitalize truncate">
            {session?.status || "Active"}
          </p>
          {session && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
              {timeRange ?? "Time not set"}
            </p>
          )}
        </div>
      </div>

      {/* Percentage Card */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
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
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Attendance Rate
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Target: {targetPercentage}%
          </p>
        </div>
      </div>

      {/* Present Count */}
      <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
          <Users size={24} />
        </div>
        <div className="min-w-0">
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
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="min-w-0">
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
