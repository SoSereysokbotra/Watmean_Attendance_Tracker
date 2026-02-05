"use client";

import { useState } from "react";
import {
  Download,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Search,
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

const reports = [
  {
    id: 1,
    className: "Physics 101: Mechanics",
    date: "2026-01-25",
    present: 24,
    absent: 4,
    rate: 86,
  },
  {
    id: 2,
    className: "Chemistry 201: Organic",
    date: "2026-01-24",
    present: 22,
    absent: 6,
    rate: 79,
  },
  {
    id: 3,
    className: "Math 301: Calculus",
    date: "2026-01-23",
    present: 25,
    absent: 3,
    rate: 89,
  },
];

const trendData = [
  { date: "Mon", rate: 71 },
  { date: "Tue", rate: 96 },
  { date: "Wed", rate: 89 },
  { date: "Thu", rate: 79 },
  { date: "Fri", rate: 86 },
];

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredReports = reports.filter(
    (report) =>
      (!fromDate || report.date >= fromDate) &&
      (!toDate || report.date <= toDate),
  );

  const avgRate = Math.round(
    filteredReports.reduce((acc, curr) => acc + curr.rate, 0) /
      (filteredReports.length || 1),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Attendance analytics for Spring Semester 2026
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-xl border border-border">
            <CalendarIcon size={16} className="text-muted-foreground" />
            <input
              type="date"
              className="bg-transparent border-none text-sm focus:ring-0 text-foreground p-0"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:shadow-brand-primary/30 transition-all">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Avg. Attendance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{avgRate}%</span>
            <span className="text-sm text-emerald-600 font-medium flex items-center">
              <ArrowUpRight size={14} /> 2.4%
            </span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Active Students
          </p>
          <span className="text-3xl font-bold">142</span>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Total Sessions
          </p>
          <span className="text-3xl font-bold">{reports.length}</span>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            At Risk
          </p>
          <span className="text-3xl font-bold text-rose-600">3</span>
          <p className="text-sm text-muted-foreground">students</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-muted-foreground" />{" "}
            Attendance Trend
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--brand-primary)"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--brand-primary)"
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
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--brand-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Class Performance
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={reports} barGap={4}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="className"
                  type="category"
                  width={110}
                  tickFormatter={(val: string) => val.split(":")[0]}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                  }}
                />
                <Bar dataKey="rate" barSize={24} radius={[4, 4, 4, 4]}>
                  {reports.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.rate > 80
                          ? "var(--brand-primary)"
                          : "var(--muted)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-foreground text-lg">Recent Sessions</h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search classes..."
              className="pl-9 pr-4 py-2 bg-muted border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="px-6 py-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
            >
              <div className="flex-1">
                <span className="font-semibold text-foreground">
                  {report.className}
                </span>
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {new Date(report.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-bold"
                    >
                      S{i + 1}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-muted/50 border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                    +{report.present - 3}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${report.rate > 80 ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {report.rate}%
                  </span>
                  <div className="flex-1 h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary"
                      style={{
                        width: `${report.rate}%`,
                        opacity: report.rate / 100,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
