"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  Navigation,
  Clock,
  Calendar,
  MoreHorizontal,
  MapPin,
  X,
  CheckCircle2,
  Search,
  Bell,
} from "lucide-react";

// --- Map Imports ---
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

// Dynamic loading for Map components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

// --- Custom Components ---

// 1. Map Event Handler
const LocationMarker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// 2. Custom Icon (Using a generic blue that likely matches brand-primary, or standardizing)
const getPickerIcon = () => {
  return L.divIcon({
    className: "custom-picker-icon",
    html: `<div class="relative flex h-6 w-6">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-6 w-6 bg-blue-600 border-2 border-white shadow-lg"></span>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function TeacherDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "analytics"
  >("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newSession, setNewSession] = useState({
    className: "",
    time: "08:00",
    lat: 11.5564,
    lng: 104.9282,
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Launching Session at:", newSession.lat, newSession.lng);
    setIsModalOpen(false);
  };

  // Mock Data
  const stats = [
    {
      title: "Total Classes",
      value: "12",
      change: "+2 this month",
      icon: BookOpen,
      colorClass: "text-brand-primary",
      bgClass: "bg-brand-primary/10",
    },
    {
      title: "Active Students",
      value: "142",
      change: "+5 enrollments",
      icon: Users,
      colorClass: "text-indigo-500",
      bgClass: "bg-indigo-500/10",
    },
    {
      title: "Avg. Attendance",
      value: "92.4%",
      change: "+2.1% trend",
      icon: TrendingUp,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
    {
      title: "At Risk",
      value: "3",
      change: "Requires action",
      icon: AlertCircle,
      colorClass: "text-rose-500",
      bgClass: "bg-rose-500/10",
    },
  ];

  const recentSessions = [
    {
      id: 1,
      title: "Physics 101: Mechanics",
      time: "08:00 - 10:00",
      status: "Live Now",
      attendance: 28,
      total: 30,
      room: "Room 304",
    },
    {
      id: 2,
      title: "Calculus II",
      time: "10:30 - 12:30",
      status: "Upcoming",
      attendance: 0,
      total: 32,
      room: "Hall A",
    },
    {
      id: 3,
      title: "Intro to CS",
      time: "Yesterday",
      status: "Completed",
      attendance: 42,
      total: 45,
      room: "Lab 2",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand-primary/30 pb-20">
      {/* --- Header --- */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Watmean</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center rounded-full bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background"></span>
            </button>
            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-brand-primary to-indigo-500 text-sm font-bold text-white shadow-md ring-offset-2 hover:ring-2 ring-brand-primary transition-all">
              PD
            </div>
          </div>
        </div>
      </header>

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
            onClick={() => setIsModalOpen(true)}
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
                  <span className="inline-block rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-600">
                    {stat.change}
                  </span>
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
            <div className="lg:col-span-2 space-y-6">
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
                <div className="divide-y divide-border">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="group flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`
                          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm
                          ${session.status === "Live Now" ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}
                        `}
                        >
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
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {session.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            Attendance
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.attendance}/{session.total} Present
                          </div>
                        </div>
                        {session.status === "Live Now" ? (
                          <span className="flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            {session.status}
                          </span>
                        )}
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dark Theme Quick Actions (Matching Auth Page Side) */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-brand-dark p-6 text-white shadow-xl">
                {/* Branding Accent mimicking the Auth Page */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-brand-primary blur-3xl opacity-20 pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
                  <div className="grid gap-3">
                    <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10">
                      <Navigation className="h-4 w-4 text-brand-primary" />
                      Calibrate GPS
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10">
                      <Users className="h-4 w-4 text-indigo-400" />
                      Manage Roster
                    </button>
                    <button className="group flex w-full flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium">
                          Export Reports
                        </span>
                      </div>
                      <span className="ml-7 text-xs text-white/50 group-hover:text-white/70">
                        CSV format available
                      </span>
                    </button>
                  </div>

                  {/* Footer Accent from Auth Page */}
                  <div className="mt-6 flex gap-2 opacity-50">
                    <div className="h-1 w-8 rounded-full bg-brand-primary"></div>
                    <div className="h-1 w-2 rounded-full bg-white/20"></div>
                    <div className="h-1 w-2 rounded-full bg-white/20"></div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    New
                  </span>
                </div>
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? "bg-brand-primary" : "bg-muted-foreground/30"}`}
                      ></div>
                      <div>
                        <p className="text-sm text-foreground">
                          Automatic sync completed for{" "}
                          <span className="font-semibold">Calculus II</span>.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
            <div className="text-center">
              <Users className="mx-auto mb-3 h-10 w-10 opacity-20" />
              <p>Student Roster Component</p>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-3 h-10 w-10 opacity-20" />
              <p>Advanced Analytics Component</p>
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
                  Launch New Session
                </h2>
                <p className="text-sm text-muted-foreground">
                  Define parameters for student check-in.
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Class Name
                    </label>
                    <input
                      required
                      placeholder="e.g. Physics 101"
                      value={newSession.className}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          className: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSession.time}
                      onChange={(e) =>
                        setNewSession({ ...newSession, time: e.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm outline-none ring-offset-2 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Geofence Location
                    </label>
                    <span className="font-mono text-[10px] text-brand-primary">
                      {newSession.lat.toFixed(5)}, {newSession.lng.toFixed(5)}
                    </span>
                  </div>

                  <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border ring-offset-2 focus-within:ring-2 focus-within:ring-brand-primary/20">
                    <MapContainer
                      center={[newSession.lat, newSession.lng]}
                      zoom={17}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[newSession.lat, newSession.lng]}
                        icon={getPickerIcon()}
                      />
                      <Circle
                        center={[newSession.lat, newSession.lng]}
                        pathOptions={{
                          color: "#2563eb",
                          fillColor: "#2563eb",
                          fillOpacity: 0.1,
                          weight: 1,
                        }}
                        radius={50}
                      />
                      <LocationMarker
                        onLocationSelect={(lat, lng) =>
                          setNewSession((prev) => ({ ...prev, lat, lng }))
                        }
                      />
                    </MapContainer>
                    <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                      Click map to update pin
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-brand-primary/5 p-4 border border-brand-primary/10">
                  <div className="rounded-full bg-brand-primary/10 p-1 text-brand-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      Secure Verification
                    </span>
                    <p className="text-muted-foreground">
                      Students must be within 50m of this location to attend.
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
                className="flex-1 rounded-xl bg-brand-primary py-3.5 font-bold text-white shadow-lg shadow-brand-primary/25 transition-all hover:bg-brand-primary/90 hover:shadow-brand-primary/40"
              >
                Launch Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
