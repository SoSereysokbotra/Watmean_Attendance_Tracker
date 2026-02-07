"use client";

/**
 * Teacher Active Class Page
 * Displays live attendance tracking and session management
 */

import { useState } from "react";
import { MapPin, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudents, useAttendance, useClassData } from "@/hooks";
import { Student } from "@/types";
import {
  SessionStats,
  LiveActivityTab,
  StudentListTab,
  SettingsTab,
  HistoryTab,
} from "./components";

// Mock initial student data - will be replaced with API call
const INITIAL_STUDENTS: Student[] = [
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

export default function ClassDetailPage() {
  const [activeTab, setActiveTab] = useState("Live Attendance");

  // Custom hooks for data management
  const { students, toggleStatus, removeStudent } =
    useStudents(INITIAL_STUDENTS);
  const stats = useAttendance(students);
  const { classInfo, session } = useClassData();

  // Tab configuration
  const tabs = ["Live Attendance", "Student List", "History", "Settings"];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {classInfo?.name || "Loading..."}
          </h1>
          {classInfo && (
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {classInfo.batch}
              </span>
              <span className="w-1 h-1 bg-border rounded-full"></span>
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {classInfo.room}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Session Statistics */}
      <SessionStats session={session} stats={stats} targetPercentage={90} />

      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {tabs.map((tab) => (
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
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Live Attendance" && (
        <LiveActivityTab students={students} />
      )}

      {activeTab === "Student List" && (
        <StudentListTab
          students={students}
          onToggleStatus={toggleStatus}
          onRemoveStudent={removeStudent}
        />
      )}

      {activeTab === "History" && <HistoryTab />}

      {activeTab === "Settings" && <SettingsTab />}
    </div>
  );
}
