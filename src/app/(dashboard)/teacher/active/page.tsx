"use client";

/**
 * Teacher Active Class Page
 * Displays live attendance tracking and session management
 */

import { useState, useEffect } from "react";
import { MapPin, Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudents, useAttendance } from "@/hooks"; // Removed useClassData, we will fetch it
import { Student } from "@/types";
import {
  SessionStats,
  LiveActivityTab,
  StudentListTab,
  SettingsTab,
  HistoryTab,
} from "./components";

export default function ClassDetailPage() {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We'll initialize useStudents with empty array and update it when data loads
  // However, useStudents hook might expect initial data.
  // If useStudents manages state internally, we might need to useEffect to setStudents.
  // For now, let's assume we can pass the fetched students to the tabs directly
  // or that useStudents can be initialized later.
  // Actually, looking at the previous code: const { students, toggleStatus, ... } = useStudents(INITIAL_STUDENTS);
  // I will assume I need to fetch first, then render the hook-dependent parts.

  const [initialStudents, setInitialStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    try {
      const response = await fetch("/api/teacher/active");
      if (!response.ok) {
        throw new Error("Failed to load active session");
      }
      const data = await response.json();

      if (data.activeSession) {
        setSessionData(data.activeSession);

        if (data.activeSession.students) {
          const mappedStudents = data.activeSession.students.map(
            (student: any) => ({
              id: student.studentId || student.id,
              name: student.name || student.fullName || "Unknown Student",
              avatar: null, // API doesn't return avatar yet
              checkInTime: null, // We would need attendance records for this
              distance: null,
              status: "absent", // Default
            }),
          );
          setInitialStudents(mappedStudents);
        }
      }
    } catch (error) {
      console.error("Error fetching active session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only render hook-dependent logic when we have data or finished loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-foreground">
          No Active Session
        </h2>
        <p className="text-muted-foreground mt-2">
          You don't have any classes scheduled for right now.
        </p>
      </div>
    );
  }

  return (
    <ActiveSessionView
      initialStudents={initialStudents}
      classInfo={{
        name: sessionData.name,
        batch: sessionData.code,
        room: sessionData.room || "Online",
      }}
      session={{
        id: sessionData.sessionId, // Correctly use session ID
        sessionId: sessionData.sessionId, // Redundant but safe
        classId: sessionData.id, // Keep class ID separate just in case
        startTime: sessionData.startTime ? sessionData.startTime : "", // simplistic parsing
        endTime: sessionData.endTime ? sessionData.endTime : "",
        status: "active",
        attendanceCode: "1234", // Mock code
        room: sessionData.room, // Pass room
        radius: sessionData.radius, // Pass radius
      }}
    />
  );
}

// Sub-component to safely use hooks with fetched data
function ActiveSessionView({
  initialStudents,
  classInfo,
  session,
}: {
  initialStudents: Student[];
  classInfo: any;
  session: any;
}) {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const { students, toggleStatus, removeStudent } =
    useStudents(initialStudents);
  const stats = useAttendance(students);
  const tabs = ["Live Attendance", "Student List", "History", "Settings"];

  const handleUpdate = async (
    data: Partial<{ radius: number; room: string }>,
  ) => {
    try {
      const response = await fetch("/api/teacher/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id || session.sessionId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update session");
      }

      // Ideally update local state or re-fetch session data, but for now just log
      console.log("Session updated successfully");
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update settings.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {classInfo.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {classInfo.batch}
            </span>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {session.room || classInfo.room}
            </span>
          </div>
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

      {activeTab === "Settings" && (
        <SettingsTab
          session={{
            id: session.id || session.sessionId,
            radius: session.radius,
            room: session.room || classInfo.room,
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
