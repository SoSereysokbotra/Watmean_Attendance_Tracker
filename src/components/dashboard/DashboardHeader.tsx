"use client";

interface DashboardHeaderProps {
  studentName: string;
  todayClasses: number;
  currentSession: string;
  className?: string;
}

export function DashboardHeader({
  studentName,
  todayClasses,
  currentSession,
  className = "",
}: DashboardHeaderProps) {
  return (
    <div className={`flex justify-between items-end ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
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
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-muted-foreground">
          Current Session
        </p>
        <p className="text-xl font-bold text-foreground">{currentSession}</p>
      </div>
    </div>
  );
}
