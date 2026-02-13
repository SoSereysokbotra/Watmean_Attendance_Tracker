"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Calendar, Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudents, useAttendance } from "@/hooks";
import { Student } from "@/types";
import {
  SessionStats,
  LiveActivityTab,
  StudentListTab,
  SettingsTab,
  HistoryTab,
} from "./components";
import { useSearchParams } from "next/navigation";

export default function ClassDetailPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");

  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [initialStudents, setInitialStudents] = useState<Student[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchActiveSession = useCallback(async () => {
    try {
      const url = classId
        ? `/api/teacher/active?classId=${classId}`
        : "/api/teacher/active";
      const response = await fetch(url);
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
              avatar: student.avatar || null,
              checkInTime: student.checkInTime || null, // Use checkInTime from API
              distance: null,
              status: student.status || "absent", // Use status from API, default to absent only if missing
            }),
          );
          setInitialStudents(mappedStudents);
        } else {
          setInitialStudents([]);
        }
        setRefreshKey((k) => k + 1); // Remount view so newly joined students appear
      }
    } catch (error) {
      console.error("Error fetching active session:", error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

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
      key={refreshKey}
      initialStudents={initialStudents}
      onRefresh={fetchActiveSession}
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
  onRefresh,
}: {
  initialStudents: Student[];
  classInfo: any;
  session: any;
  onRefresh?: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [refreshing, setRefreshing] = useState(false);
  const { students, setStudents, toggleStatus, removeStudent } =
    useStudents(initialStudents);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };
  const stats = useAttendance(students);
  const tabs = ["Live Attendance", "Student List", "History", "Settings"];

  const handleToggleStatus = async (
    studentId: string,
    status: "present" | "absent" | "late" | "excused",
  ) => {
    const prev = students.find((s) => s.id === studentId);
    // Optimistic UI update
    toggleStatus(studentId, status);

    try {
      const response = await fetch("/api/teacher/active/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id || session.sessionId,
          classId: session.classId,
          studentId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update attendance");
      }
    } catch (error) {
      console.error("Failed to persist attendance status:", error);
      // Revert if API fails
      if (prev?.status) toggleStatus(studentId, prev.status);
      alert("Failed to update student status. Please try again.");
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    const prevStudents = students;
    // Optimistic remove
    removeStudent(studentId);

    try {
      const response = await fetch("/api/teacher/active/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: session.classId,
          studentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove student");
      }
    } catch (error) {
      console.error("Failed to remove student:", error);
      // Revert if API fails
      setStudents(prevStudents);
      alert("Failed to remove student. Please try again.");
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {classInfo.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {classInfo.batch}
            </span>
            <span className="w-1 h-1 bg-border rounded-full hidden sm:inline-block"></span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {session.room || classInfo.room}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh to see newly joined students"
            className="w-full sm:w-auto"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Session Statistics */}
      <SessionStats session={session} stats={stats} targetPercentage={90} />

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex gap-6 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
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
          onToggleStatus={handleToggleStatus}
          onRemoveStudent={handleRemoveStudent}
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
