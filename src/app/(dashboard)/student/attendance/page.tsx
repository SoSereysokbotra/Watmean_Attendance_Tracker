"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  XCircle,
  AlertTriangle,
  FileText,
  BookOpen,
  MoreHorizontal,
  Target,
  HelpCircle,
} from "lucide-react";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { format } from "date-fns";

export default function StudentAttendanceView() {
  const [activeTab, setActiveTab] = useState("all");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/student/attendance");
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.history.map((record: any) => ({
            id: record.id,
            course: `${record.className} (${record.classCode})`,
            prof: record.teacherName, // Assuming join provides this
            room: record.room,
            date: new Date(record.date).toLocaleDateString(),
            time: record.checkInTime || "--",
            status:
              record.status.charAt(0).toUpperCase() + record.status.slice(1),
            signal: "High", // Mock signal mostly
            gps: "GPS Verified",
            icon: BookOpen,
            colorClass: "brand-primary",
          }));
          setAttendanceData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredData = attendanceData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "absent") return item.status === "Absent";
    if (activeTab === "disputed") return item.status === "Disputed";
    return true;
  });

  const getIcon = (label: string, size: number = 20) => {
    switch (label) {
      case "Attendance Rate":
        return <Target size={size} />;
      case "Classes Missed":
        return <XCircle size={size} />;
      case "Late Arrivals":
        return <Clock size={size} />;
      case "Excused":
        return <FileText size={size} />;
      default:
        return <CheckCircle2 size={size} />;
    }
  };

  // Calculate actual stats from data
  const totalClasses = attendanceData.length;
  const presentCount = attendanceData.filter(
    (d) => d.status === "Present",
  ).length;
  const lateCount = attendanceData.filter((d) => d.status === "Late").length;
  const absentCount = attendanceData.filter(
    (d) => d.status === "Absent",
  ).length;
  const excusedCount = attendanceData.filter(
    (d) => d.status === "Excused",
  ).length;
  const attendanceRate =
    totalClasses > 0
      ? Math.round(((presentCount + lateCount) / totalClasses) * 100)
      : 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            My Attendance
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Track your semester attendance history and performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* WRAP THE BUTTON IN POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-xl text-sm font-semibold shadow-sm hover:bg-muted hover:border-muted-foreground/30 transition-all">
                <CalendarIcon size={16} />
                {/* Optional: Show selected date or just "History" */}
                {date ? format(date, "PPP") : "History"}
              </button>
            </PopoverTrigger>

            {/* THE CALENDAR CONTENT */}
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* DOWNLOAD BUTTON (Unchanged) */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:shadow-brand-primary/30 transition-all active:scale-95">
            <Download size={16} /> Download Log
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-8 relative">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-primary/10 blur-[100px] -z-10 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-100/20 dark:bg-rose-900/10 blur-[100px] -z-10 rounded-full" />

        {[
          {
            label: "Attendance Rate",
            val: `${attendanceRate}%`,
            sub: "Semester Goal: 85%",
            trend: attendanceRate >= 85 ? "Good" : "Warning",
            color: "text-emerald-600 dark:text-emerald-400",
            accent: "bg-emerald-500",
          },
          {
            label: "Classes Missed",
            val: absentCount.toString(),
            sub: "Total Sessions",
            trend: absentCount > 3 ? "Warning" : "Good",
            color: "text-rose-600 dark:text-rose-400",
            accent: "bg-rose-500",
          },
          {
            label: "Late Arrivals",
            val: lateCount.toString(),
            sub: "Avg. 5 mins",
            trend: "Stable",
            color: "text-amber-600 dark:text-amber-400",
            accent: "bg-amber-500",
          },
          {
            label: "Excused",
            val: excusedCount.toString(),
            sub: "Medical Leave",
            trend: "Approved",
            color: "text-blue-600 dark:text-blue-400",
            accent: "bg-blue-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative flex flex-col group cursor-default transition-all duration-300"
          >
            <div
              className={`h-1 w-12 rounded-full mb-6 transition-all duration-500 group-hover:w-20 ${stat.accent}`}
            />
            <div className="flex items-baseline gap-2">
              <h3
                className={`text-5xl font-black tracking-tighter text-foreground group-hover:scale-105 transition-transform origin-left`}
              >
                {stat.val}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.trend === "Good" || stat.trend === "Approved"
                    ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted border-border text-muted-foreground"
                } border`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-foreground tracking-wide uppercase text-[11px]">
                {stat.label}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.sub}
                </p>
              </div>
            </div>
            <div
              className={`absolute -right-4 top-0 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all duration-500 ${stat.color}`}
            >
              {getIcon(stat.label, 80)}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table Section */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card gap-4">
          <div>
            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
              {activeTab === "disputed"
                ? "Open Disputes"
                : activeTab === "absent"
                  ? "Missed Classes"
                  : "My Recent Classes"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "disputed"
                ? "Track the status of your attendance appeals"
                : "Check your recent check-ins and signal validity"}
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-3 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "all"
                  ? "bg-card text-foreground border-border shadow-sm"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab("absent")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "absent"
                  ? "bg-card text-foreground border-border shadow-sm"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"
              }`}
            >
              Absences
            </button>
            <button
              onClick={() => setActiveTab("disputed")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "disputed"
                  ? "bg-card text-foreground border-border shadow-sm"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"
              }`}
            >
              Disputes
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 px-8 py-4 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-12 md:col-span-4 pl-2">Course Info</div>
          <div className="hidden md:block col-span-3">Check-in Time</div>
          <div className="hidden md:block col-span-3">My Signal</div>
          <div className="col-span-12 md:col-span-2 text-right pr-2">
            Status
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/50">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p>No records found for this filter.</p>
            </div>
          ) : (
            filteredData.map((record) => {
              const bgColor =
                record.colorClass === "brand-primary"
                  ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                  : "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400";

              const hoverBgColor =
                record.colorClass === "brand-primary"
                  ? "group-hover:bg-brand-primary group-hover:text-primary-foreground"
                  : "group-hover:bg-blue-600 group-hover:text-primary-foreground";

              const hoverTextColor =
                record.colorClass === "brand-primary"
                  ? `group-hover:text-brand-primary`
                  : `group-hover:text-blue-600`;

              return (
                <div
                  key={record.id}
                  className="grid grid-cols-12 px-8 py-5 items-center hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  {/* Column 1: Course Info */}
                  <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                    <div>
                      <p
                        className={`font-bold text-foreground text-base transition-colors ${hoverTextColor}`}
                      >
                        {record.course}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {record.room} • {record.prof}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Time */}
                  <div className="col-span-6 md:col-span-3 mt-4 md:mt-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {record.date}
                      </span>
                      <span
                        className={`text-xs flex items-center gap-1.5 mt-1 font-medium ${
                          record.status === "Present"
                            ? "text-muted-foreground"
                            : record.status === "Late"
                              ? "text-amber-600 dark:text-amber-400 font-bold"
                              : record.status === "Disputed"
                                ? "text-blue-600 dark:text-blue-400 font-bold"
                                : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {record.status === "Present" && (
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500"
                          />
                        )}
                        {record.status === "Late" && <Clock size={12} />}
                        {record.status === "Absent" && <XCircle size={12} />}
                        {record.status === "Disputed" && (
                          <HelpCircle size={12} />
                        )}
                        {record.status === "Disputed"
                          ? "Details Sent"
                          : record.status === "Absent"
                            ? "No Check-in"
                            : `Checked in: ${record.time}`}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Signal/GPS */}
                  <div className="col-span-6 md:col-span-3 mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                          record.status === "Disputed"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30"
                            : record.status === "Absent"
                              ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30"
                              : "bg-muted border-border"
                        }`}
                      >
                        <MapPin
                          size={14}
                          className={
                            record.status === "Present"
                              ? "text-emerald-500"
                              : record.status === "Disputed"
                                ? "text-blue-500"
                                : record.status === "Absent"
                                  ? "text-rose-400"
                                  : "text-muted-foreground"
                          }
                        />
                        <span
                          className={`text-xs font-mono font-bold ${
                            record.status === "Disputed"
                              ? "text-blue-700 dark:text-blue-300"
                              : record.status === "Absent"
                                ? "text-rose-700 dark:text-rose-300"
                                : "text-foreground"
                          }`}
                        >
                          {record.signal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Status Badge */}
                  <div className="col-span-12 md:col-span-2 text-right mt-4 md:mt-0 flex md:justify-end justify-between items-center">
                    <span className="md:hidden text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Status
                    </span>

                    {record.status === "Present" && (
                      <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-sm">
                        <CheckCircle2
                          size={14}
                          className="fill-emerald-600 dark:fill-emerald-400 text-primary-foreground"
                        />{" "}
                        Present
                      </span>
                    )}
                    {record.status === "Late" && (
                      <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800 text-xs font-bold shadow-sm">
                        <AlertTriangle
                          size={14}
                          className="fill-amber-500 dark:fill-amber-400 text-primary-foreground"
                        />{" "}
                        Late
                      </span>
                    )}
                    {record.status === "Absent" && (
                      <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full border border-rose-200 dark:border-rose-800 text-xs font-bold shadow-sm">
                        <XCircle
                          size={14}
                          className="fill-rose-500 dark:fill-rose-400 text-primary-foreground"
                        />{" "}
                        Absent
                      </span>
                    )}
                    {record.status === "Disputed" && (
                      <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800 text-xs font-bold shadow-sm">
                        <HelpCircle
                          size={14}
                          className="fill-blue-500 dark:fill-blue-400 text-primary-foreground"
                        />{" "}
                        Reviewing
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted px-8 py-4 border-t border-border flex justify-center">
          <button className="text-sm font-semibold text-muted-foreground hover:text-brand-primary flex items-center gap-1 transition-colors">
            Load More Records <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
