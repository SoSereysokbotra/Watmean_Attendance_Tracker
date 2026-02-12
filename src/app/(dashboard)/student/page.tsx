"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/student/DashboardHeader";
import { StatsCard } from "@/components/student/StatsCard";
import { NextClassCard } from "@/components/student/NextClassCard";
import { ScheduleItem } from "@/components/student/ScheduleItem";
import { DashboardSection } from "@/components/student/DashboardSection";
import { TrendingUp, Clock, AlertTriangle, Loader2 } from "lucide-react";

interface DashboardData {
  user: {
    name: string;
    initials: string;
    studentId: string;
    email: string;
  };
  stats: {
    attendancePercentage: number;
    lateArrivals: number;
    classesMissed: number;
    excused: number;
    todayClasses: number;
  };
  nextClass: {
    id: string;
    name: string;
    schedule: string;
    room: string;
    teacherName: string;
    code: string;
  } | null;
  todaySchedule: Array<{
    className: string;
    schedule: string;
    room: string;
    status: string;
    isFinished: boolean;
  }>;
  currentSession: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/student/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <AlertTriangle className="h-10 w-10 mb-4 text-destructive" />
        <p>{error || "No data available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        studentName={data.user.name}
        todayClasses={data.stats.todayClasses}
        currentSession={data.currentSession}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Overall Attendance"
          value={`${data.stats.attendancePercentage}%`}
          icon={<TrendingUp size={24} />}
        />

        {data.nextClass ? (
          <NextClassCard
            time={data.nextClass.schedule?.split(" ")[0] || "TBD"} // Simplified time extraction
            subject={data.nextClass.name}
            room={data.nextClass.room || "TBD"}
            professor={data.nextClass.teacherName || "TBD"}
            checkInPath={`/student/checkin?classId=${data.nextClass.id}`}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border/40 p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <div className="bg-brand-primary/10 p-3 rounded-full mb-3">
              <Clock className="text-brand-primary" size={24} />
            </div>
            <h3 className="font-semibold text-lg">No Upcoming Classes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're all clearer for now!
            </p>
          </div>
        )}

        <StatsCard
          title="Late Arrivals"
          value={data.stats.lateArrivals.toString()}
          icon={<Clock size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DashboardSection title="Today's Schedule">
          <div className="space-y-4">
            {data.todaySchedule.length > 0 ? (
              data.todaySchedule.map((cls, index) => {
                // Ensure status is valid, default to 'upcoming' if not
                const validStatus = [
                  "present",
                  "upcoming",
                  "absent",
                  "late",
                ].includes(cls.status)
                  ? (cls.status as "present" | "upcoming" | "absent" | "late")
                  : "upcoming";

                return (
                  <ScheduleItem
                    key={index}
                    time={cls.schedule?.split(" ")[0] || "TBD"}
                    period="AM" // Placeholder, would parse from schedule
                    title={cls.className}
                    location={`${cls.room || "TBD"}`}
                    status={validStatus}
                    statusText={
                      cls.status.charAt(0).toUpperCase() + cls.status.slice(1)
                    }
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                No classes scheduled for today.
              </div>
            )}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
