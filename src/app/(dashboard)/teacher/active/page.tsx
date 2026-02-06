"use client";

import { SetStateAction, useState } from "react";
import {
  MapPin,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Download,
  Filter,
  RefreshCw,
  Smartphone,
  Settings,
  AlertCircle,
  BarChart3,
  Timer,
} from "lucide-react";

// Mock data for students
const students = [
  {
    id: "KIT-B13-001",
    name: "So Sereysokbotra",
    avatar: "https://i.pravatar.cc/100?img=32",
    checkInTime: "08:05 AM",
    distance: "5m",
    status: "present",
  },
  {
    id: "KIT-B13-005",
    name: "Jane Doe",
    avatar: "https://i.pravatar.cc/100?img=12",
    checkInTime: "08:12 AM",
    distance: "12m",
    status: "present",
  },
  {
    id: "KIT-B13-009",
    name: "John Doe",
    avatar: null,
    checkInTime: null,
    distance: null,
    status: "absent",
  },
];

const history = [
  { date: "2026-01-24", present: 25, absent: 3 },
  { date: "2026-01-23", present: 26, absent: 2 },
  { date: "2026-01-22", present: 24, absent: 4 },
];

// Button Component Replacement
const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: {
  variant?: "primary" | "secondary" | "outline" | "link" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyle =
    "font-medium transition-colors flex items-center justify-center gap-2";

  const sizeStyles = {
    sm: "px-3 py-1 rounded-lg text-sm",
    md: "px-4 py-2 rounded-lg text-sm",
    lg: "px-6 py-3 rounded-lg text-base",
    icon: "w-10 h-10 p-0 rounded-lg",
  };

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-orange-600",
    secondary:
      "bg-brand-dark text-white hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline:
      "border border-border text-foreground hover:bg-muted bg-background",
    link: "text-blue-600 hover:text-blue-700 p-0 h-auto",
    ghost: "text-muted-foreground hover:bg-muted font-normal",
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component Replacement
const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default function ClassDetailPage() {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [searchTerm, setSearchTerm] = useState("");

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const attendancePercentage = Math.round(
    (presentCount / students.length) * 100,
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* ================= HEADER & ACTIONS ================= */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Physics 101: Mechanics
          </h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> Batch 13
            </span>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> Room A-204
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Moved Export here */}
          <button className="font-medium transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm border border-border text-foreground hover:bg-muted bg-background text-muted-foreground">
            <Download size={16} className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* ================= NEW: SESSION STATUS BAR ================= */}
      {/* This replaces the right sidebar stats card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
            <Timer size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Status
            </p>
            <p className="font-bold text-foreground">Active</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              08:00 - 10:00
            </p>
          </div>
        </div>

        {/* Percentage Card */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Simple ring visualization */}
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
                strokeDasharray={`${attendancePercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <span className="absolute text-xs font-bold text-foreground">
              {attendancePercentage}%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Attendance Rate
            </p>
            <p className="text-xs text-muted-foreground">Target: 90%</p>
          </div>
        </div>

        {/* Present Count */}
        <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
              Present
            </p>
            <p className="text-2xl font-bold text-foreground">{presentCount}</p>
          </div>
        </div>

        {/* Absent Count */}
        <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
              Absent
            </p>
            <p className="text-2xl font-bold text-foreground">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {["Live Attendance", "Student List", "History", "Settings"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* 1. LIVE ATTENDANCE */}
      {activeTab === "Live Attendance" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-3">
            <h3 className="font-bold text-foreground">Recent Activity</h3>
            {students
              .filter((s) => s.status === "present")
              .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      <img
                        src={
                          student.avatar ||
                          `https://ui-avatars.com/api/?name=${student.name}`
                        }
                        alt={student.name}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Checked in at {student.checkInTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {student.distance} away
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. STUDENT LIST */}
      {activeTab === "Student List" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <input
              placeholder="Search students..."
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="font-medium transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm border border-border text-foreground hover:bg-muted bg-background">
              <Filter size={16} className="mr-2" /> Filter
            </button>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                          <img
                            src={
                              student.avatar ||
                              `https://ui-avatars.com/api/?name=${student.name}`
                            }
                          />
                        </div>
                        {student.name}
                      </td>
                      <td className="px-6 py-4">
                        {student.status === "present" ? (
                          <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md text-xs font-bold">
                            Present
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md text-xs font-bold">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.checkInTime || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SETTINGS - Consolidated Right Sidebar content here */}
      {activeTab === "Settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Location Settings (Previously in sidebar) */}
          <div className="bg-card p-6 rounded-2xl border border-border space-y-6 lg:col-span-2">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin size={20} className="text-brand-primary" /> Location
                Configuration
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage geofencing and classroom targets.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl border border-border">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Target Classroom
                </label>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-foreground">
                    Room A-204 (Block B)
                  </span>
                  <button className="font-medium transition-colors flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-sm border border-border text-foreground hover:bg-muted bg-background h-8 text-xs">
                    Change
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Geofence Radius
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    defaultValue={50}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-24"
                  />
                  <span className="text-sm text-muted-foreground">meters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HISTORY (Kept Simple) */}
      {activeTab === "History" && (
        <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
          <p>Select a date range to view historical logs</p>
        </div>
      )}
    </div>
  );
}
