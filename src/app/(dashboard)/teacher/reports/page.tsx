"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";


const trendDataMock = [
  { date: "Mon", rate: 71 },
  { date: "Tue", rate: 96 },
  { date: "Wed", rate: 89 },
  { date: "Thu", rate: 79 },
  { date: "Fri", rate: 86 },
];

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/teacher/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      console.log("Reports Data:", data);

      // The API currently returns a stats object in 'reports' key
      setStats(data.reports);
      setReports([]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate simple stats (from API or fallback)
  const avgRate = stats?.averageAttendance || 0;
  const totalStudents = stats?.totalStudents || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background min-h-screen relative overflow-hidden">
      {/* Background Blobs (Copied from Student View) */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-primary/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-100/20 dark:bg-rose-900/10 blur-[100px] -z-10 rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Class Reports
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Attendance analytics for Spring Semester 2026
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

      {/* Stats Grid (Refactored to match Student 'Summary Section') */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-4">
        {[
          {
            label: "Avg. Attendance",
            val: `${avgRate}%`,
            sub: "Up 2.4% vs last week",
            trend: "Good",
            accent: "bg-emerald-500",
            icon: <TrendingUp size={80} />,
            colorClass: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Active Students",
            val: `${totalStudents}`,
            sub: "Total enrolled",
            trend: "Stable",
            accent: "bg-blue-500",
            icon: <Users size={80} />,
            colorClass: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Total Sessions",
            val: `${stats?.totalClasses || 0}`,
            sub: "This semester",
            trend: "On Track",
            accent: "bg-amber-500",
            icon: <Clock size={80} />,
            colorClass: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "At Risk",
            val: `${stats?.lowAttendanceStudents || 0}`,
            sub: "Students < 75%",
            trend: "Action Needed",
            accent: "bg-rose-500",
            icon: <AlertCircle size={80} />,
            colorClass: "text-rose-600 dark:text-rose-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative flex flex-col group cursor-default transition-all duration-300"
          >
            {/* The colored top bar */}
            <div
              className={`h-1 w-12 rounded-full mb-6 transition-all duration-500 group-hover:w-20 ${stat.accent}`}
            />
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black tracking-tighter text-foreground group-hover:scale-105 transition-transform origin-left">
                {stat.val}
              </h3>
              {/* Trend Badge */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  stat.trend === "Action Needed"
                    ? "bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800 text-rose-600"
                    : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-600"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-foreground tracking-wide uppercase text-[11px]">
                {stat.label}
              </p>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {stat.sub}
              </p>
            </div>
            {/* Hover Icon Effect */}
            <div
              className={`absolute -right-4 top-0 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all duration-500 ${stat.colorClass}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            Weekly Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendDataMock}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {/* Using brand-primary for the gradient top */}
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--brand-primary))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--brand-primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--brand-dark))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--brand-dark))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                    color: "hsl(var(--brand-dark))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--brand-primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Performance
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Using mock reports for now as we don't have list data in API response yet */}
              <BarChart
                layout="vertical"
                data={reports.length > 0 ? reports : []}
                barGap={4}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="className"
                  type="category"
                  width={100}
                  tickFormatter={(val: string) => val.split(":")[0]}
                  tick={{
                    fill: "hsl(var(--brand-dark))",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                    color: "hsl(var(--brand-dark))",
                  }}
                />
                <Bar dataKey="rate" barSize={32} radius={[6, 6, 6, 6]}>
                  {reports.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.rate > 80
                          ? "hsl(var(--brand-primary))"
                          : entry.rate < 70
                            ? "var(--destructive)"
                            : "hsl(var(--brand-dark))" /* Changed muted to brand-dark */
                      }
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
