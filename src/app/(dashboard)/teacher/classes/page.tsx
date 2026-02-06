"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  BookOpen,
  Activity,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

interface Class {
  id: string;
  name: string;
  code: string;
  students: number;
  attendanceRate: number;
  schedule: string;
  location: string;
  status: "active" | "upcoming" | "ended";
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "Physics 101: Mechanics",
      code: "PHY101",
      students: 28,
      attendanceRate: 94,
      schedule: "Mon, Wed, Fri • 08:00-10:00",
      location: "Room A-204",
      status: "active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: Class["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "upcoming":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "ended":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your classes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search classes..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus size={16} className="mr-2" />
            New Class
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-card rounded-2xl border border-border p-6 hover:border-brand-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(cls.status)}`}
                >
                  {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                </span>
                <h3 className="font-bold text-xl text-foreground mt-2">
                  {cls.name}
                </h3>
                <p className="text-sm text-muted-foreground">{cls.code}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>{cls.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{cls.location}</span>
              </div>
            </div>

            <div className="mb-6">
              {/* <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Attendance Rate</span>
                 <span className="font-bold">{cls.attendanceRate}%</span>
              </div> */}
              {/* <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cls.attendanceRate >= 90
                      ? "bg-emerald-500"
                      : cls.attendanceRate >= 80
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                  style={{ width: `${cls.attendanceRate}%` }}
                />
              </div> */}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/teacher/active`}
                className="flex-1 py-2.5 text-center bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors text-sm"
              >
                Take Attendance
              </Link>
              <Link
                href={`/teacher/classes/${cls.id}`}
                className="flex-1 py-2.5 text-center border border-border rounded-lg font-medium hover:bg-muted transition-colors text-sm"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No classes found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or create a new class
          </p>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus size={16} className="mr-2" />
            Create New Class
          </Button>
        </div>
      )}
    </div>
  );
}
