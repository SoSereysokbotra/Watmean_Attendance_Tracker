"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  MapPin,
  Search,
  Users,
  Target,
  MoreHorizontal,
  Bell,
  CheckCircle2,
  XCircle,
  Plus,
  Settings,
  ChevronRight,
} from "lucide-react";

// Mock Data
const activeZones = [
  {
    id: 1,
    name: "Physics 101",
    room: "Room 204",
    radius: 50,
    current: 28,
    total: 30,
    status: "active",
    alerts: 0,
    coords: { top: "35%", left: "25%" },
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "CompSci 300",
    room: "Lab 3",
    radius: 25,
    current: 40,
    total: 42,
    status: "active",
    alerts: 2,
    coords: { top: "55%", left: "60%" },
    color: "bg-indigo-500",
  },
  {
    id: 3,
    name: "History 101",
    room: "Main Hall",
    radius: 100,
    current: 0,
    total: 50,
    status: "pending",
    alerts: 0,
    coords: { top: "20%", left: "50%" },
    color: "bg-gray-400",
  },
];

export default function CleanTeacherMap() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedZone = activeZones.find((z) => z.id === selectedId);

  return (
    // CHANGE 1: Adjusted container height and styling to fit inside the Dashboard Layout
    // - Removed h-screen (which conflicts with layout header)
    // - Added h-[calc(100vh-9rem)] to fill remaining space dynamically
    // - Added rounded corners and borders to match dashboard aesthetic
    <div className="flex h-[calc(100vh-9rem)] w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans">
      {/* ----------------------------------------------------------------------
          1. MAIN MAP AREA (Left Side)
      ---------------------------------------------------------------------- */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        {/* Map Background */}
        {/* Note: In a real app, ensure your map component handles container resizing */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/104.9282,11.5564,15,0/1600x1200?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-90 grayscale-[10%]" />

        {/* Top Overlay Bar */}
        <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start pointer-events-none gap-4">
          {/* Title Area */}
          <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm border border-gray-100 pointer-events-auto flex items-center gap-4">
            <div className="bg-gray-900 text-white p-2 rounded-lg">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                Live Campus Monitor
              </h1>
              <p className="text-xs text-gray-500">
                {activeZones.filter((z) => z.status === "active").length} Active
                Classes
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex gap-2 pointer-events-auto">
            <div className="relative group hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                className="w-48 lg:w-64 pl-9 bg-white/90 backdrop-blur-md border-gray-100 shadow-sm rounded-xl focus:ring-indigo-500"
                placeholder="Search class..."
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl px-4">
              <Plus size={16} className="mr-2" />{" "}
              <span className="hidden sm:inline">New Class</span>
            </Button>
          </div>
        </div>

        {/* Map Markers */}
        {activeZones.map((zone) => {
          const isSelected = selectedId === zone.id;
          return (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: zone.coords.top, left: zone.coords.left }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(zone.id);
              }}
            >
              {/* RADIUS VISUALIZATION */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 pointer-events-none flex items-center justify-center
                  ${
                    isSelected
                      ? `w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/10 border-indigo-500/30`
                      : `w-24 h-24 sm:w-32 sm:h-32 opacity-0 group-hover:opacity-100 bg-gray-500/5 border-dashed border-gray-400`
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-0 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full -mt-2.5">
                    {zone.radius}m Radius
                  </div>
                )}
              </div>

              {/* CENTER PIN */}
              <div
                className={`relative flex flex-col items-center transition-transform duration-300 ${isSelected ? "scale-110" : "hover:-translate-y-1"}`}
              >
                {zone.alerts > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-20 animate-pulse" />
                )}

                <div
                  className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center text-white transition-colors duration-300
                  ${isSelected ? "bg-gray-900 ring-4 ring-white/50" : zone.color}
                `}
                >
                  <span className="font-bold text-xs">
                    {zone.name.substring(0, 2)}
                  </span>
                </div>

                <div
                  className={`mt-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-100 text-xs font-semibold whitespace-nowrap transition-opacity
                   ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                `}
                >
                  {zone.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------------
          2. DETAILS PANEL (Right Side)
      ---------------------------------------------------------------------- */}
      {/* CHANGE 2: Made sidebar width responsive and cleaner borders */}
      <div className="w-[300px] lg:w-[360px] bg-white border-l border-gray-200 hidden md:flex flex-col z-10">
        {selectedZone ? (
          <>
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedZone.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400"
                >
                  <MoreHorizontal size={18} />
                </Button>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin size={14} /> {selectedZone.room}
              </p>

              <div className="mt-4 flex gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedZone.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedZone.status === "active"
                    ? "Live Session"
                    : "Pending"}
                </span>
                {selectedZone.alerts > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {selectedZone.alerts} Alerts
                  </span>
                )}
              </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
              <div className="p-6 text-center hover:bg-gray-50 transition-colors group cursor-pointer">
                <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                  Geofence
                </p>
                <div className="flex items-center justify-center gap-2 text-indigo-600">
                  <Target size={20} />
                  <span className="text-2xl font-bold">
                    {selectedZone.radius}m
                  </span>
                </div>
                <p className="text-[10px] text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Edit
                </p>
              </div>

              <div className="p-6 text-center hover:bg-gray-50 transition-colors">
                <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                  Attendance
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-900">
                  <Users size={20} className="text-gray-400" />
                  <span className="text-2xl font-bold">
                    {selectedZone.current}
                  </span>
                  <span className="text-sm text-gray-400">
                    / {selectedZone.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Alert List */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={14} /> Recent Activity
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <XCircle size={14} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Out of Bounds
                    </p>
                    <p className="text-xs text-gray-500">
                      Student <span className="text-gray-900">Sokheng</span>{" "}
                      moved outside the {selectedZone.radius}m radius.
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      2 mins ago
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Check-in Verified
                    </p>
                    <p className="text-xs text-gray-500">
                      5 students clocked in successfully.
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      10 mins ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm flex justify-between group">
                <span className="flex items-center gap-2">
                  <Settings size={16} /> Class Settings
                </span>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Select a Class</h3>
            <p className="text-sm text-gray-500 mt-2">
              Click a pin on the map to view the geofence radius and student
              attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
