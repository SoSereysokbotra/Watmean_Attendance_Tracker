"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentId: string;
  classesCount: number;
  attendanceRate: number;
  status: "Good" | "Warning" | "At Risk";
}

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teacher/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "risk" && student.status === "At Risk");

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="animate-pulse text-muted-foreground">
          Loading students...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Enrolled Students
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage students across all your classes.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 sm:w-64"
            />
          </div>
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "all" ? "risk" : "all")
            }
            className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
              statusFilter === "risk"
                ? "border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Filter className="h-4 w-4" />
            {statusFilter === "risk" ? "Showing At Risk" : "Filter"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Student</th>
              <th className="px-6 py-4 font-medium">Classes</th>
              <th className="px-6 py-4 font-medium">Attendance Rate</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {student.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      {student.classesCount} Classes
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            student.attendanceRate >= 85
                              ? "bg-emerald-500"
                              : student.attendanceRate >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="font-medium">
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {student.status === "Good" && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-600">Good</span>
                        </>
                      )}
                      {student.status === "Warning" && (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-amber-600">Warning</span>
                        </>
                      )}
                      {student.status === "At Risk" && (
                        <>
                          <AlertCircle className="h-4 w-4 text-rose-500" />
                          <span className="text-rose-600">At Risk</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus:ring-2 focus:ring-brand-primary/20">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-1">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              (window.location.href = `mailto:${student.email}`)
                            }
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </button>
                          <button
                            onClick={() =>
                              alert(`View profile for ${student.name}`)
                            } // Placeholder for profile view
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                          >
                            <div className="h-4 w-4 flex items-center justify-center rounded-full border border-current text-[10px] font-bold">
                              i
                            </div>
                            View Profile
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
