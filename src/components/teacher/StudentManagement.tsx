"use client";

import { useState } from "react";
import {
  Users,
  Filter,
  Download,
  Mail,
  Phone,
  MoreVertical,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: "present" | "absent" | "late" | "at-risk";
  attendanceRate: number;
  lastSeen: string;
  class: string;
  selected?: boolean;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "S001",
      name: "So Sereysokbotra",
      email: "serey@student.kit.edu",
      phone: "+855 123 456 789",
      avatar: "https://i.pravatar.cc/100?img=32",
      status: "present",
      attendanceRate: 95,
      lastSeen: "Today, 08:05 AM",
      class: "Physics 101",
    },
    {
      id: "S002",
      name: "Jane Doe",
      email: "jane@student.kit.edu",
      phone: "+855 987 654 321",
      avatar: "https://i.pravatar.cc/100?img=12",
      status: "late",
      attendanceRate: 82,
      lastSeen: "Today, 08:25 AM",
      class: "Physics 101",
    },
    {
      id: "S003",
      name: "John Smith",
      email: "john@student.kit.edu",
      phone: "+855 456 789 123",
      avatar: "https://i.pravatar.cc/100?img=45",
      status: "at-risk",
      attendanceRate: 65,
      lastSeen: "Yesterday, 09:15 AM",
      class: "Physics 101",
    },
    {
      id: "S004",
      name: "Alice Johnson",
      email: "alice@student.kit.edu",
      phone: "+855 321 654 987",
      avatar: "https://i.pravatar.cc/100?img=5",
      status: "absent",
      attendanceRate: 88,
      lastSeen: "2 days ago",
      class: "Physics 101",
    },
  ]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "mark-present":
        setStudents((prev) =>
          prev.map((s) =>
            selectedStudents.includes(s.id) ? { ...s, status: "present" } : s,
          ),
        );
        break;
      case "send-email":
        const selectedEmails = students
          .filter((s) => selectedStudents.includes(s.id))
          .map((s) => s.email);
        console.log("Sending email to:", selectedEmails);
        break;
      case "export":
        console.log("Exporting selected students");
        break;
    }
  };

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "present":
        return "bg-emerald-100 text-emerald-700";
      case "absent":
        return "bg-rose-100 text-rose-700";
      case "late":
        return "bg-amber-100 text-amber-700";
      case "at-risk":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header with Bulk Actions - already responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search students..."
              className="pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>

        {selectedStudents.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground">
              {selectedStudents.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("mark-present")}
            >
              <CheckCircle size={16} className="mr-2" />
              Mark Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("send-email")}
            >
              <Mail size={16} className="mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("export")}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Status Filter Tabs - already has overflow-x-auto */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "present", "absent", "late", "at-risk"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? "bg-brand-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {status === "all"
              ? "All Students"
              : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-2">
                ({students.filter((s) => s.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Students Table - already has overflow-x-auto */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Attendance</th>
                <th className="p-4 font-semibold">Last Seen</th>
                <th className="p-4 font-semibold">Class</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={
                            student.avatar ||
                            `https://ui-avatars.com/api/?name=${student.name}`
                          }
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {student.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail size={12} />
                          <span className="truncate">{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.attendanceRate >= 90
                              ? "bg-emerald-500"
                              : student.attendanceRate >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap">
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Clock size={14} />
                      {student.lastSeen}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full font-medium whitespace-nowrap">
                      {student.class}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 hover:bg-muted rounded">
                        <Mail size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <Phone size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical
                          size={16}
                          className="text-muted-foreground"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
