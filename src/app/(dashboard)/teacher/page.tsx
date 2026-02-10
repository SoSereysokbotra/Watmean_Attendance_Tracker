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
}

interface Session {
  id: string;
  title: string;
  time: string;
  status: string;
  attendance: number;
  total: number;
  room: string;
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

  useEffect(() => {
    setMounted(true);
    fetchClasses();
  }, []);

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
        // Refresh dashboard data if needed
      } else {
        console.error("Failed to launch session");
      }
    } catch (error) {
      console.error("Error launching session:", error);
    } finally {
      setLaunching(false);
    }
  };

  const handleEditSession = (session: any) => {
    // Editing logic remains similar or needs update depending on backend support
    // For now, implementing simple launch
    console.log("Edit not fully implemented yet");
  };

  const handleViewDetails = (id: number) => {
    router.push(`/teacher/classes/${id}`);
  };

  // Mock Data (Replace with real data fetching eventually)
  const stats = [
    {
      title: "Total Classes",
      value: classes.length.toString(),
      icon: BookOpen,
      colorClass: "text-brand-primary",
      bgClass: "bg-brand-primary/10",
    },
    {
      title: "Active Students",
      value: "0",
      icon: Users,
      colorClass: "text-indigo-500",
      bgClass: "bg-indigo-500/10",
    },
    {
      title: "Avg. Attendance",
      value: "0%",
      icon: TrendingUp,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
    {
      title: "At Risk",
      value: "0",
      icon: AlertCircle,
      colorClass: "text-rose-500",
      bgClass: "bg-rose-500/10",
    },
  ];

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  const deleteSession = (id: number) => {
    // Delete logic
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
              Welcome back, Prof. Davis. Manage your attendance securely.
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
              { id: "analytics", label: "Analytics" },
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
                  <button className="text-sm font-medium text-brand-primary hover:underline">
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
      </main>

      {/* --- MODAL (Clean & Minimal) --- */}
      {isModalOpen && mounted && (
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
                    : "Define parameters for student check-in."}
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
                {/* --- Class Details --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newSession.classId}
                      onChange={(e) => {
                        const selectedClass = classes.find(
                          (c) => c.id === e.target.value,
                        );
                        setNewSession({
                          ...newSession,
                          classId: e.target.value,
                          className: selectedClass?.name || "",
                        });
                      }}
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <option value="" disabled>
                        Select a class...
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </option>
                      ))}
                    </select>
                  </div>
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
                </div>

                {/* --- Time Details --- */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
                  <div className="space-y-10">
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
                        setNewSession({ ...newSession, date: e.target.value })
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

                {/* --- Geofence Details --- */}
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

                <div className="flex items-start gap-3 rounded-xl bg-brand-primary/5 p-4 border border-brand-primary/10">
                  <div className="rounded-full bg-brand-primary/10 p-1 text-brand-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      Verification Zone
                    </span>
                    <p className="text-muted-foreground">
                      Students must be within{" "}
                      <span className="font-bold text-foreground">
                        {newSession.radius}m
                      </span>{" "}
                      of this location to check in.
                    </p>
                  </div>
                </div>
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
