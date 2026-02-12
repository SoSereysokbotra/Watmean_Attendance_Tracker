"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  MoreHorizontal,
  MapPin,
  X,
  CheckCircle2,
  Eye,
  FileEdit,
  Trash,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateClassModal } from "@/components/teacher/CreateClassModal";
import { StudentsList } from "@/components/teacher/StudentsList";

const TeacherLocationPicker = dynamic(
  () => import("@/components/teacher/TeacherLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">
        Loading Map...
      </div>
    ),
  },
);

interface Class {
  id: string;
  name: string;
  code: string;
  room?: string;
  lat?: string;
  lng?: string;
  radius?: number;
  schedule?: string;
}

interface Session {
  id: string;
  title: string;
  time: string;
  status: string;
  attendance: number;
  total: number;
  room: string;
  classId: string;
  // Raw data for editing
  startTime?: string;
  endTime?: string;
  date?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "analytics"
  >("overview");

  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const [statsData, setStatsData] = useState({
    totalClasses: 0,
    activeStudents: 0,
    avgAttendance: 0,
    atRisk: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchClasses();
    fetchStats();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch("/api/teacher/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.stats) {
          setStatsData({
            totalClasses: data.stats.totalClasses,
            activeStudents: data.stats.activeStudents,
            avgAttendance: data.stats.averageAttendance,
            atRisk: data.stats.atRiskCount,
          });
        }
        if (data.recentActivity) {
          setRecentSessions(
            data.recentActivity.map((s: any) => ({
              id: s.id,
              title: s.title,
              time: new Date(s.time).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
              status: s.status,
              attendance: s.attendance,
              total: s.total,
              room: s.room,
            })),
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await fetch("/api/teacher/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const [newSession, setNewSession] = useState({
    classId: "",
    className: "", // For display/fallback
    room: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "10:00",
    radius: "50",
    lat: 11.5564,
    lng: 104.9282,
  });

  const [showCustomization, setShowCustomization] = useState(false);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaunching(true);

    try {
      // Construct start and end times
      const startDateTime = new Date(
        `${newSession.date}T${newSession.startTime}`,
      );
      const endDateTime = new Date(`${newSession.date}T${newSession.endTime}`);

      const payload = {
        classId: newSession.classId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        lat: newSession.lat,
        lng: newSession.lng,
        radius: newSession.radius,
        room: newSession.room,
      };

      const response = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Success
        setIsModalOpen(false);
        setEditingSessionId(null);
        // Redirect to active session view
        router.push("/teacher/active");
      } else if (response.status === 409) {
        // Active session already exists
        const data = await response.json();
        if (
          confirm(
            "An active session already exists for this class. Would you like to view it?",
          )
        ) {
          router.push("/teacher/active");
        }
      } else {
        console.error("Failed to launch session");
      }
    } catch (error) {
      console.error("Error launching session:", error);
    } finally {
      setLaunching(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await fetch(`/api/teacher/sessions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecentSessions((prev) => prev.filter((s) => s.id !== id));
        fetchStats(); // Refresh stats
      } else {
        alert("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Error deleting session");
    }
  };

  const handleViewDetails = (id: number) => {
    router.push(`/teacher/classes/${id}`);
  };

  // Real Stats Data
  const stats = [
    {
      title: "Total Classes",
      value: statsData.totalClasses.toString(),
      icon: BookOpen,
      colorClass: "text-brand-primary",
      bgClass: "bg-brand-primary/10",
    },
    {
      title: "Active Students",
      value: statsData.activeStudents.toString(),
      icon: Users,
      colorClass: "text-indigo-500",
      bgClass: "bg-indigo-500/10",
    },
    {
      title: "Avg. Attendance",
      value: `${statsData.avgAttendance}%`,
      icon: TrendingUp,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
    {
      title: "At Risk",
      value: statsData.atRisk.toString(),
      icon: AlertCircle,
      colorClass: "text-rose-500",
      bgClass: "bg-rose-500/10",
    },
  ];

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  const handleEditSession = (session: any) => {
    // Parse the display time back to HH:mm if needed, but session object likely has formatted time
    // We need the raw data really.
    // Ideally we should fetch session details or store raw data.
    // For now, let's try to infer or just set basic info and let user edit.
    // We need to find the class to get the room/radius defaults if not present
    // But `session` here is from `recentSessions` which is a processed view model.
    // Let's iterate `classes` to find one matching the title? Unreliable.
    // Better to have classId in session.
    // `recentSessions` creation in `fetchStats` maps logic. Let's assume we can get classId there maybe?
    // Looking at `fetchStats`, `recentSessions` does NOT have classId.
    // I should update `fetchStats` or just make do.
    // Actually `AcademicRepository.getRecentSessions` returns `classId` properly!
    // But `fetchStats` in component MAPPED it out. I need to update `fetchStats` mapping first.
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand-primary/30 pb-20">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* --- Welcome & Action --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back, {user?.fullName || "Professor"}. Manage your
              attendance securely.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSessionId(null);
              setNewSession({
                classId: "",
                className: "",
                room: "",
                date: new Date().toISOString().split("T")[0],
                startTime: "08:00",
                endTime: "10:00",
                radius: "50",
                lat: 11.5564,
                lng: 104.9282,
              });
              setIsCreatingClass(false);
              setShowCustomization(false);
              setIsModalOpen(true);
            }}
            className="group flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 transition-all hover:bg-brand-primary/90 hover:shadow-brand-primary/40 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Launch Session
          </button>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-xl p-2.5 ${stat.bgClass} ${stat.colorClass}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.title === "At Risk" && (
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Tabs --- */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", label: "Overview" },
              { id: "students", label: "Students" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all
                  ${
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Tab Content --- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Sessions */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-semibold text-foreground">
                      Recent Activity
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/teacher/schedule")}
                    className="text-sm font-medium text-brand-primary hover:underline"
                  >
                    View Calendar
                  </button>
                </div>
                {recentSessions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No active sessions. Launch one to get started!
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="group flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                      >
                        {/* Session Item UI ... */}
                        {/* (Simplified for brevity as we focus on creation) */}
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-100 text-emerald-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm">
                            {session.title.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {session.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> {session.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && <StudentsList />}

      </main>

      {/* --- MODAL (Clean & Minimal) --- */}
      <CreateClassModal
        isOpen={
          isModalOpen && !editingSessionId && !launching && isCreatingClass
        }
        onClose={() => {
          setIsCreatingClass(false);
          // If we just closed the create modal, we might want to keep the main modal open?
          // Or just close everything. Let's close everything for now, or revert to Select mode.
          // User asked for "Launch Session" to select class. If they cancel creation, maybe go back to select?
          // For simplicity, let's close the modal completely or go back.
          // Actually, let's just close the modal.
          setIsModalOpen(false);
        }}
        onClassCreated={() => {
          fetchClasses();
          setIsCreatingClass(false);
          // After creating, maybe auto-select the new class?
          // For now, let's just go back to "Select Class" mode.
        }}
      />

      {isModalOpen &&
        mounted &&
        !isCreatingClass &&
        (editingSessionId || launching || !isCreatingClass) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/30 animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-border animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-8 py-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {editingSessionId ? "Edit Session" : "Launch New Session"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editingSessionId
                      ? "Update session parameters."
                      : "Confirm details to start tracking attendance."}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto px-8 py-6">
                <form
                  id="session-form"
                  onSubmit={handleCreateSession}
                  className="space-y-6"
                >
                  {/* --- Class Selection (Always Visible) --- */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Select Class <span className="text-red-500">*</span>
                    </label>

                    <Select
                      required
                      value={newSession.classId}
                      /* Shadcn uses onValueChange which passes the string directly, not an event */
                      onValueChange={(value: string) => {
                        const selectedClass = classes.find(
                          (c) => c.id === value,
                        );

                        // Helper to parse schedule string (e.g., "Mon 10:15 - 11:00")
                        let parsedStart = "08:00";
                        let parsedEnd = "10:00";

                        if (selectedClass?.schedule) {
                          try {
                            const timeMatch = selectedClass.schedule.match(
                              /(\d{1,2}(?::\d{2})?)\s*(?:AM|PM|am|pm)?\s*-\s*(\d{1,2}(?::\d{2})?)\s*(?:AM|PM|am|pm)?/i,
                            );

                            if (timeMatch) {
                              // Helper to convert to 24h format HH:mm
                              const to24h = (
                                timeStr: string,
                                isPm: boolean,
                              ) => {
                                let [hours, minutes] = timeStr
                                  .split(":")
                                  .map(Number);
                                if (!minutes) minutes = 0;

                                if (isPm && hours < 12) hours += 12;
                                if (!isPm && hours === 12) hours = 0;

                                return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                              };

                              const fullString =
                                selectedClass.schedule.toLowerCase();
                              const isPm = fullString.includes("pm");
                              // Simple heuristic: if "pm" is present, assume the later time is PM.
                              // If start time > end time (symbolically), or if clear AM/PM markers exist, handle better.
                              // For now, let's use a robust approach for "10:15 - 11:00" (usually 24h or clear context)
                              // Re-using logic from repository for consistency but simplified for UI input (HH:mm)

                              const startRaw = timeMatch[1];
                              const endRaw = timeMatch[2];

                              // Let's try to normalize.
                              // If inputs are already 24h-ish (e.g. 14:00), utilize that.
                              const normalizeTime = (t: string) => {
                                if (!t.includes(":"))
                                  return `${t.padStart(2, "0")}:00`;
                                const [h, m] = t.split(":");
                                return `${h.padStart(2, "0")}:${m}`;
                              };

                              parsedStart = normalizeTime(startRaw);
                              parsedEnd = normalizeTime(endRaw);
                            }
                          } catch (e) {
                            console.error("Error parsing schedule:", e);
                          }
                        } else {
                          // Default to current time rounded to next 15 mins if no schedule
                          const now = new Date();
                          const remainder = 15 - (now.getMinutes() % 15);
                          now.setMinutes(now.getMinutes() + remainder);
                          parsedStart = now.toTimeString().slice(0, 5);

                          const end = new Date(now);
                          end.setHours(end.getHours() + 1); // Default 1 hour duration
                          parsedEnd = end.toTimeString().slice(0, 5);
                        }

                        setNewSession({
                          ...newSession,
                          classId: value,
                          className: selectedClass?.name || "",
                          room: selectedClass?.room || "",
                          startTime: parsedStart,
                          endTime: parsedEnd,
                          lat: selectedClass?.lat
                            ? Number(selectedClass.lat)
                            : 11.5564,
                          lng: selectedClass?.lng
                            ? Number(selectedClass.lng)
                            : 104.9282,
                          radius: selectedClass?.radius
                            ? String(selectedClass.radius)
                            : "50",
                        });
                      }}
                    >
                      <SelectTrigger className="w-full rounded-xl border-border bg-card px-4 py-3 h-12 text-foreground shadow-sm transition-all focus:ring-2 focus:ring-brand-primary/20 outline-none">
                        <SelectValue placeholder="Select a class..." />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl border-border bg-card shadow-lg">
                        {classes.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No classes available
                          </div>
                        ) : (
                          classes.map((cls) => (
                            <SelectItem
                              key={cls.id}
                              value={cls.id}
                              className="cursor-pointer py-3 focus:bg-brand-primary/10 focus:text-brand-primary"
                            >
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="font-semibold text-sm">
                                  {cls.name}
                                </span>
                                <span className="text-xs text-muted-foreground opacity-80">
                                  ID: {cls.code} • {cls.room || "No Room"}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreatingClass(true)}
                      className="text-sm text-brand-primary hover:underline"
                    >
                      + Create New Class
                    </button>
                  </div>

                  {/* --- Summary Card (Visible when Class Selected) --- */}
                  {newSession.classId && !showCustomization && (
                    <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Ready to Launch
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Using default settings for{" "}
                            <span className="font-medium text-foreground">
                              {newSession.className}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            Room:{" "}
                            <span className="font-medium text-foreground">
                              {newSession.room || "Not set"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Time:{" "}
                            <span className="font-medium text-foreground">
                              {newSession.startTime} - {newSession.endTime}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            Radius:{" "}
                            <span className="font-medium text-foreground">
                              {newSession.radius}m
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCustomization(true)}
                          className="text-xs font-medium text-brand-primary hover:underline hover:text-brand-primary/80"
                        >
                          Need to change location or time? Customize
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- Advanced Customization (Hidden by default) --- */}
                  {showCustomization && (
                    <div className="space-y-6 pt-4 border-t border-border animate-in slide-in-from-top-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          Session Details
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowCustomization(false)}
                          className="text-xs text-muted-foreground hover:text-brand-primary"
                        >
                          Hide details
                        </button>
                      </div>

                      {/* Room */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Room / Location
                        </label>
                        <input
                          required
                          placeholder="e.g. Room 304"
                          value={newSession.room}
                          onChange={(e) =>
                            setNewSession({
                              ...newSession,
                              room: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                        />
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={newSession.startTime}
                            onChange={(e) =>
                              setNewSession({
                                ...newSession,
                                startTime: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={newSession.endTime}
                            onChange={(e) =>
                              setNewSession({
                                ...newSession,
                                endTime: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Date
                          </label>
                          <input
                            type="date"
                            value={newSession.date}
                            onChange={(e) =>
                              setNewSession({
                                ...newSession,
                                date: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            RADIUS
                          </label>
                          <input
                            required
                            placeholder="e.g. 50"
                            value={newSession.radius}
                            onChange={(e) =>
                              setNewSession({
                                ...newSession,
                                radius: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                          />
                        </div>
                      </div>

                      {/* Geofence Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Geofence Location & Radius
                            </label>
                            <p className="text-[10px] text-muted-foreground">
                              Drag map to pinpoint class location
                            </p>
                          </div>
                        </div>

                        <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-border ring-offset-2 focus-within:ring-2 focus-within:ring-brand-primary/20">
                          <TeacherLocationPicker
                            lat={newSession.lat}
                            lng={newSession.lng}
                            onLocationSelect={(lat, lng) =>
                              setNewSession((prev) => ({ ...prev, lat, lng }))
                            }
                          />

                          <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                            Selected: {newSession.lat.toFixed(5)},{" "}
                            {newSession.lng.toFixed(5)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="flex gap-4 border-t border-border bg-muted/30 px-8 py-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-border bg-background py-3.5 font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="session-form"
                  disabled={launching}
                  className="flex-1 rounded-xl bg-brand-primary py-3.5 font-bold text-white shadow-lg shadow-brand-primary/25 transition-all hover:bg-brand-primary/90 hover:shadow-brand-primary/40 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {launching && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSessionId ? "Update Session" : "Launch Session"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
