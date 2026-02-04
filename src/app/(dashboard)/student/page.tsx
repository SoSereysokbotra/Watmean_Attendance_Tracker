"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { ScheduleItem } from "@/components/dashboard/ScheduleItem";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { TrendingUp, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        studentName="Sarah"
        todayClasses={2}
        currentSession="Fall Semester 2024"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Overall Attendance"
          value="89%"
          icon={<TrendingUp size={24} />}
          trend={{ value: "+4%", isPositive: true }}
        />

        <NextClassCard
          time="14:00"
          subject="Physics 101"
          room="Room 304"
          professor="Prof. Davis"
          checkInPath="/student/checkin"
        />

        <StatsCard
          title="Late Arrivals"
          value="2"
          icon={<Clock size={24} />}
          trend={{ value: "+1", isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Today's Schedule">
          <div className="space-y-4">
            <ScheduleItem
              time="09:00"
              period="AM"
              title="Computer Science 101"
              location="Lecture Hall A • Attended"
              status="present"
              statusText="Present"
            />

            <ScheduleItem
              time="14:00"
              period="PM"
              title="Physics 101"
              location="Room 304 • Upcoming"
              status="upcoming"
              statusText="Check In"
              showCheckIn={true}
              checkInPath="/student/checkin"
            />

            <ScheduleItem
              time="16:00"
              period="PM"
              title="Math 201"
              location="Hall B • Completed"
              status="present"
              statusText="Present"
            />
          </div>
        </DashboardSection>

        <DashboardSection
          title="Recent Attendance Alerts"
          action={
            <Link
              href="/student/attendance"
              className="text-sm text-brand-primary hover:underline font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
              <AlertTriangle
                className="text-amber-600 dark:text-amber-400"
                size={20}
              />
              <div>
                <p className="font-medium text-foreground">Late Check-in</p>
                <p className="text-sm text-muted-foreground">
                  Chemistry Lab - 5 mins late
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
              <TrendingUp
                className="text-emerald-600 dark:text-emerald-400"
                size={20}
              />
              <div>
                <p className="font-medium text-foreground">
                  Attendance Improved
                </p>
                <p className="text-sm text-muted-foreground">
                  Your attendance rate increased by 4%
                </p>
              </div>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
