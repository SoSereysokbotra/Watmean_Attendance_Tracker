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
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
