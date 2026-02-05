"use client";

import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklyData = [
  { day: "Mon", present: 24, absent: 3, late: 2 },
  { day: "Tue", present: 26, absent: 1, late: 1 },
  { day: "Wed", present: 23, absent: 4, late: 3 },
  { day: "Thu", present: 25, absent: 2, late: 2 },
  { day: "Fri", present: 22, absent: 5, late: 1 },
];

const classPerformance = [
  { name: "Physics 101", attendance: 94, students: 28 },
  { name: "Calculus II", attendance: 88, students: 32 },
  { name: "Chemistry 201", attendance: 91, students: 25 },
  { name: "Biology 101", attendance: 85, students: 30 },
];

const attendanceDistribution = [
  { name: "Present", value: 75, color: "#10b981" },
  { name: "Absent", value: 12, color: "#ef4444" },
  { name: "Late", value: 8, color: "#f59e0b" },
  { name: "Excused", value: 5, color: "#8b5cf6" },
];

export function EnhancedAnalytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Attendance
            </span>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">92.4%</p>
          <p className="text-xs text-emerald-600">+2.1% from last week</p>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Avg. Check-in Time
            </span>
            <Clock className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">08:12 AM</p>
          <p className="text-xs text-muted-foreground">
            Session starts at 08:00 AM
          </p>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              At Risk Students
            </span>
            <AlertCircle className="text-rose-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-rose-600">3</p>
          <p className="text-xs text-rose-600">Needs attention</p>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Target Accuracy
            </span>
            <Target className="text-brand-primary" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">98.5%</p>
          <p className="text-xs text-muted-foreground">±2m precision</p>
        </div>
      </div>
    </div>
  );
}
