"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  MapPin,
  ArrowRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  List,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// const schedule = [
//   {
//     id: "1",
//     className: "Physics 101: Mechanics",
//     date: "2026-01-26",
//     time: "08:00 - 10:00 AM",
//     startTime: "08:00 AM",
//     endTime: "10:00 AM",
//     location: "Classroom A-204",
//   },
//   {
//     id: "2",
//     className: "Chemistry 201: Organic",
//     date: "2026-01-27",
//     time: "10:30 - 12:30 PM",
//     startTime: "10:30 AM",
//     endTime: "12:30 PM",
//     location: "Lab B-101",
//   },
//   {
//     id: "3",
//     className: "Math 301: Calculus",
//     date: "2026-01-28",
//     time: "02:00 - 04:00 PM",
//     startTime: "02:00 PM",
//     endTime: "04:00 PM",
//     location: "Classroom C-305",
//   },
// ];

interface ScheduleItem {
  id: string;
  className: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  location: string;
}

export default function SchedulePage() {
  const router = useRouter();
  // View State: 'day' | 'month'
  const [viewMode, setViewMode] = useState<"day" | "month">("day");
  const [activeDate, setActiveDate] = useState(
    new Date().toISOString().split("T")[0],
  ); // Default to today

  // Calendar State (defaults to current month)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch("/api/teacher/schedule");
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      const data = await response.json();

      console.log("Schedule API Response:", data);

      // Map API data to frontend format
      const formattedSchedule = data.schedule.map((item: any) => {
        const start = new Date(item.start);
        const end = new Date(item.end);

        return {
          id: item.id,
          className: item.title,
          date: start.toISOString().split("T")[0], // YYYY-MM-DD
          time: `${formatTime(start)} - ${formatTime(end)}`,
          startTime: formatTime(start),
          endTime: formatTime(end),
          location: item.room,
        };
      });

      setSchedule(formattedSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      // toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredSchedule = useMemo(() => {
    return schedule.filter((session) => session.date === activeDate);
  }, [activeDate, schedule]);

  const getDayName = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });

  const getDayShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });

  // --- Calendar Logic Helper Functions ---
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDateClick = (day: number) => {
    // Construct YYYY-MM-DD string with local timezone handling
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const fullDate = `${year}-${month}-${dayStr}`;

    setActiveDate(fullDate);
    setViewMode("day"); // Switch back to day view to see details
  };

  // Generate Calendar Grid Data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

    // Adjust for Monday start (optional, standard in many academic calendars)
    // Currently standard Sunday start (0)
    const padding = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return { padding, days };
  }, [currentMonth]);

  const hasEventOnDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const checkDate = `${year}-${month}-${dayStr}`;
    return schedule.some((s) => s.date === checkDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your teaching schedule
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === "day" ? "month" : "day")}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-muted hover:border-border/80 transition-all"
          >
            {viewMode === "day" ? (
              <>
                <CalendarIcon size={18} /> Month View
              </>
            ) : (
              <>
                <List size={18} /> Day View
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:shadow-brand-primary/30 transition-all">
            <Bell size={18} /> Alerts
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div
          className={`space-y-6 ${viewMode === "month" ? "hidden lg:block opacity-50 pointer-events-none" : ""}`}
        >
          <div className="flex flex-col gap-3">
            {/* Show unique dates from schedule, sorted */}
            {Array.from(new Set(schedule.map((s) => s.date)))
              .sort()
              .map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setActiveDate(date);
                    setViewMode("day");
                  }}
                  className={`relative w-full text-left group transition-all duration-200 rounded-xl border px-5 py-4 ${
                    activeDate === date
                      ? "bg-card border-brand-primary shadow-md ring-1 ring-brand-primary/10 z-10"
                      : "bg-card/50 border-transparent hover:bg-card hover:border-border hover:shadow-sm hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wider ${
                          activeDate === date
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                        }`}
                      >
                        {getDayShort(date)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(date).toLocaleString("default", {
                            month: "long",
                          })}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            activeDate === date
                              ? "text-foreground"
                              : "text-muted-foreground/80 group-hover:text-foreground"
                          }`}
                        >
                          {new Date(date).getDate()}
                        </span>
                      </div>
                    </div>
                    {activeDate === date ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-sm ring-2 ring-brand-primary/20" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-border" />
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Content Area --- */}
        <div className="space-y-6">
          {/* CONDITIONAL RENDER: DAY VIEW vs MONTH VIEW */}

          {viewMode === "day" ? (
            /* --- EXISTING DAY VIEW --- */
            <>
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
                    <CalendarIcon className="text-muted-foreground" size={24} />
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

                    <div className="relative flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full border-2 border-brand-primary bg-card z-10 mt-5 group-hover:bg-brand-primary transition-colors" />
                      {index !== filteredSchedule.length - 1 && (
                        <div className="w-px h-full bg-border/60 absolute top-8" />
                      )}
                    </div>

                    <div className="flex-1 bg-card rounded-2xl p-5 border border-border shadow-sm group-hover:shadow-lg group-hover:border-brand-primary/30 transition-all duration-300 p-8">
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
                        </div>

                        <Link
                          href={`/teacher/classes/${session.id}`}
                          className="flex items-center gap-1 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          View Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* --- NEW MONTH VIEW COMPONENT --- */
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-foreground">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-6">
                {/* Weekday Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ),
                )}

                {/* Empty slots for start of month */}
                {calendarDays.padding.map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}

                {/* Days */}
                {calendarDays.days.map((day) => {
                  const isToday =
                    day === new Date().getDate() &&
                    currentMonth.getMonth() === new Date().getMonth() &&
                    currentMonth.getFullYear() === new Date().getFullYear();

                  const isSelected =
                    day === new Date(activeDate).getDate() &&
                    currentMonth.getMonth() === new Date(activeDate).getMonth();

                  const hasEvent = hasEventOnDate(day);

                  return (
                    <div key={day} className="flex flex-col items-center">
                      <button
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                          ${
                            isSelected
                              ? "bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/25 font-bold"
                              : isToday
                                ? "bg-muted text-foreground border border-brand-primary"
                                : "text-foreground hover:bg-muted hover:scale-110"
                          }
                        `}
                      >
                        {day}
                        {hasEvent && !isSelected && (
                          <div className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
