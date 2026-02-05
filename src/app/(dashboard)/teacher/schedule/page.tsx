"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Bell,
  MoreVertical,
} from "lucide-react";

const schedule = [
  {
    id: "1",
    className: "Physics 101: Mechanics",
    date: "2026-01-26",
    time: "08:00 - 10:00 AM",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    location: "Classroom A-204",
    type: "Lecture",
  },
  {
    id: "2",
    className: "Chemistry 201: Organic",
    date: "2026-01-27",
    time: "10:30 - 12:30 PM",
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    location: "Lab B-101",
    type: "Lab",
  },
  {
    id: "3",
    className: "Math 301: Calculus",
    date: "2026-01-28",
    time: "02:00 - 04:00 PM",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    location: "Classroom C-305",
    type: "Seminar",
  },
];

export default function SchedulePage() {
  const [activeDate, setActiveDate] = useState("2026-01-26");

  const filteredSchedule = useMemo(() => {
    return schedule.filter((session) => session.date === activeDate);
  }, [activeDate]);

  const getDayName = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });

  const getDayShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your teaching schedule
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl text-sm font-semibold hover:bg-muted hover:border-border/80 transition-all">
            <Calendar size={18} /> Month View
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:shadow-brand-primary/30 transition-all">
            <Bell size={18} /> Alerts
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Date Navigation */}
        <div className="space-y-6">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {Array.from(new Set(schedule.map((s) => s.date))).map((date) => (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`relative flex-shrink-0 w-full text-left group transition-all duration-200 rounded-2xl border p-4 ${
                  activeDate === date
                    ? "bg-card border-brand-primary shadow-md ring-1 ring-brand-primary/10"
                    : "bg-card/50 border-transparent hover:bg-card hover:border-border hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                        activeDate === date
                          ? "text-brand-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {getDayShort(date)}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        activeDate === date
                          ? "text-foreground"
                          : "text-muted-foreground/80"
                      }`}
                    >
                      {new Date(date).getDate()}
                    </span>
                  </div>
                  {activeDate === date && (
                    <div className="h-2 w-2 rounded-full bg-brand-primary shadow-sm" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">
              {getDayName(activeDate)}
            </h2>
            <span className="h-px flex-1 bg-border/50"></span>
            <span className="text-sm font-medium text-muted-foreground">
              {filteredSchedule.length} Sessions
            </span>
          </div>

          {filteredSchedule.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-card border border-dashed border-border">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Calendar className="text-muted-foreground" size={24} />
              </div>
              <p className="text-muted-foreground font-medium">
                No classes scheduled for this day.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {filteredSchedule.map((session, index) => (
              <div
                key={session.id}
                className="group relative flex gap-4 md:gap-6"
              >
                {/* Time Column */}
                <div className="w-20 md:w-24 pt-5 flex flex-col items-end text-right flex-shrink-0">
                  <span className="text-base font-bold text-foreground leading-none">
                    {session.startTime.split(" ")[0]}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground mt-1 uppercase">
                    {session.startTime.split(" ")[1]}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/60 mt-2">
                    {session.endTime}
                  </span>
                </div>

                {/* Visual Connector Line */}
                <div className="relative flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-brand-primary bg-card z-10 mt-5 group-hover:bg-brand-primary transition-colors" />
                  {index !== filteredSchedule.length - 1 && (
                    <div className="w-px h-full bg-border/60 absolute top-8" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 bg-card rounded-2xl p-5 border border-border shadow-sm group-hover:shadow-lg group-hover:border-brand-primary/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        session.type === "Lecture"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : session.type === "Lab"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {session.type}
                    </span>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-1">
                      {session.className}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin size={14} className="text-brand-primary" />
                      {session.location}
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-card" />
                      <div className="w-6 h-6 rounded-full bg-muted/80 border-2 border-card" />
                      <div className="w-6 h-6 rounded-full bg-muted/60 border-2 border-card flex items-center justify-center text-[8px] font-bold text-foreground">
                        +{session.type === "Lecture" ? "28" : "12"}
                      </div>
                    </div>

                    <button className="flex items-center gap-1 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
