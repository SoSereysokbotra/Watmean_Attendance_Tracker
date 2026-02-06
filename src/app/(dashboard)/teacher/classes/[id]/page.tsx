"use client";

import { use, useState } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  FileText,
  MoreHorizontal,
  Search,
  Download,
  Mail,
  GraduationCap,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

// Mock Data Interfaces
interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  attendance: number;
  grade: string;
  gradeScore: number;
  status: "present" | "absent" | "late" | "excused"; // Last class status
}

interface ClassDetails {
  id: string;
  name: string;
  code: string;
  description: string;
  schedule: string;
  location: string;
  nextSession: string;
  totalStudents: number;
  avgAttendance: number;
  avgGrade: number;
}

export default function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id } = use(params);

  const [activeTab, setActiveTab] = useState<
    "students" | "assignments"
  >("students");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Class Data (In a real app, fetch this based on `id`)
  const classData: ClassDetails = {
    id: id,
    name: "Physics 101: Mechanics",
    code: "PHY101",
    description:
      "Introduction to classical mechanics, Newton's laws, energy, and momentum.",
    schedule: "Mon, Wed, Fri • 08:00-10:00",
    location: "Room A-204",
    nextSession: "Tomorrow, 08:00 AM",
    totalStudents: 28,
    avgAttendance: 94,
    avgGrade: 86,
  };

  // Mock Student List
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.j@uni.edu",
      avatar: "AJ",
      attendance: 98,
      grade: "A",
      gradeScore: 95,
      status: "present",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.s@uni.edu",
      avatar: "BS",
      attendance: 85,
      grade: "B",
      gradeScore: 82,
      status: "late",
    }
  ]);

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90)
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (rate >= 80)
      return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
    return "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/teacher/classes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Classes
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {classData.name}
              </h1>
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold border border-brand-primary/20">
                {classData.code}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} />
                {classData.schedule}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={15} />
                {classData.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <Mail size={16} className="mr-2" />
              Email Class
            </Button>
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              <CheckCircle2 size={16} className="mr-2" />
              Take Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Class Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Session */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Next Session
            </p>
            <Clock size={18} className="text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {classData.nextSession}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Regular Class</p>
        </div>

        {/* Total Students */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Students
            </p>
            <Users size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {classData.totalStudents}
          </p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center">
            <TrendingUpIcon className="w-3 h-3 mr-1" /> +2 this week
          </p>
        </div>

        {/* Avg Attendance */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </p>
            <Activity size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {classData.avgAttendance}%
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${classData.avgAttendance}%` }}
            ></div>
          </div>
        </div>

        {/* Class Average */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Class Average
            </p>
            <GraduationCap size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {classData.avgGrade}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">B+ Average</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main Lists */}
        <div className="flex-1 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-border">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "students" ? "border-brand-primary text-brand-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "assignments" ? "border-brand-primary text-brand-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Assignments
            </button>
          </div>

          {/* Tab Content: Students */}
          {activeTab === "students" && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Student Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium text-center">
                          Attendance
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Current Grade
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Last Status
                        </th>
                        <th className="px-6 py-4 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs border border-brand-primary/20">
                                {student.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {student.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(student.attendance)}`}
                            >
                              {student.attendance}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-foreground">
                                {student.grade}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {student.gradeScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {student.status === "present" && (
                              <span className="text-emerald-600 text-xs flex items-center justify-center gap-1">
                                <CheckCircle2 size={12} /> Present
                              </span>
                            )}
                            {student.status === "absent" && (
                              <span className="text-rose-600 text-xs flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> Absent
                              </span>
                            )}
                            {student.status === "late" && (
                              <span className="text-amber-600 text-xs flex items-center justify-center gap-1">
                                <Clock size={12} /> Late
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-muted-foreground hover:text-brand-primary p-2 rounded-full hover:bg-brand-primary/10 transition-colors">
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredStudents.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No students found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="py-12 text-center border border-dashed border-border rounded-xl">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Assignments Module</h3>
              <p className="text-muted-foreground">
                Assignment management content would go here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple icon for the chart
function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
