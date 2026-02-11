"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Target,
  MoreHorizontal,
  Bell,
  CheckCircle2,
  XCircle,
  Plus,
  Settings,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------
// 1. Dynamic Import (SSR: False)
// ---------------------------------------------------------
const TeacherMap = dynamic(() => import("@/components/teacher/TeacherMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center flex-col gap-2">
      <Loader2 className="animate-spin text-brand-primary" size={32} />
      <span className="text-sm text-muted-foreground">
        Loading Campus Map...
      </span>
    </div>
  ),
});

// ---------------------------------------------------------
// 2. Data Fetching
// ---------------------------------------------------------

interface Zone {
  id: string | number;
  name: string;
  room: string;
  radius: number;
  current: number;
  total: number;
  status: string;
  alerts: number;
  lat: number;
  lng: number;
  color: string;
}

export default function TeacherLiveMap() {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedZone = zones.find((z) => z.id === selectedId);

  React.useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/teacher/classes");
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();

        // Transform and filter classes with location
        const mappedZones: Zone[] = data.classes
          .filter((cls: any) => cls.lat && cls.lng)
          .map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            room: cls.room || "Unknown Room",
            radius: Number(cls.radius) || 50,
            current: cls.activeStudents || 0,
            total: cls.totalStudents || 0,
            status: cls.status || "inactive",
            alerts: 0, // API doesn't provide alerts count yet
            lat: parseFloat(cls.lat),
            lng: parseFloat(cls.lng),
            color: cls.status === "active" ? "bg-emerald-500" : "bg-indigo-500",
          }));

        setZones(mappedZones);
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-sm flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading Class Locations...
        </span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex group font-sans relative">
      <div className="flex-1 relative z-0">
        {/* Reusable Component */}
        <TeacherMap
          zones={zones}
          selectedId={selectedId}
          onSelectZone={setSelectedId}
        />

        {/* Floating Overlay Header */}
        <div className="absolute top-0 left-0 right-0 p-0.5 z-[1000] pointer-events-none">
          <div className="pointer-events-auto bg-card/80 backdrop-blur-md rounded-xl border border-border shadow-sm p-3 flex flex-col sm:flex-row justify-between items-center gap-3 m-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Target size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Campus Monitor
                </h2>
                <p className="text-xs text-muted-foreground">
                  {zones.filter((z) => z.status === "active").length} Active
                  Sessions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative group flex-1 sm:flex-none">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <input
                  type="text"
                  className="w-full sm:w-48 pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Find class..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          Right: Sidebar Details
      --------------------------------------------------------- */}
      <div className="w-[320px] lg:w-[360px] bg-card border-l border-border hidden md:flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        {selectedZone ? (
          <>
            {/* Zone Header */}
            <div className="p-5 border-b border-border">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-foreground">
                  {selectedZone.name}
                </h2>
                <button className="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin size={14} /> {selectedZone.room}
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${selectedZone.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}
                >
                  {selectedZone.status === "active"
                    ? "Live Session"
                    : "Pending"}
                </span>
                {selectedZone.alerts > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                    {selectedZone.alerts} Alerts
                  </span>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
              <div className="p-5 flex flex-col items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer group">
                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Geofence
                </p>
                <div className="flex items-baseline gap-1 text-indigo-600">
                  <Target size={16} className="text-muted-foreground" />
                  <span className="text-2xl font-bold text-foreground">
                    {selectedZone.radius}
                  </span>
                  <span className="text-xs text-muted-foreground">m</span>
                </div>
              </div>
              <div className="p-5 flex flex-col items-center justify-center hover:bg-muted/30 transition-colors">
                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Attendance
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {selectedZone.current}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {selectedZone.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bell size={12} /> Recent Alerts
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3 group">
                  <div className="mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20">
                      <XCircle size={14} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Out of Bounds
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Student left the zone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <button className="w-full bg-brand-primary border-border hover:bg-muted text-brand-light p-3 rounded-xl text-sm font-bold shadow-sm transition-all flex justify-between items-center group">
                <span className="flex items-center gap-2">
                  <Settings size={16} /> Settings
                </span>
                <ChevronRight
                  size={16}
                  className="text-light group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/10">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 text-muted-foreground animate-pulse">
              <MapPin size={32} />
            </div>
            <h3 className="text-md font-bold text-foreground">
              No Class Selected
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Click a pin on the map to view details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
