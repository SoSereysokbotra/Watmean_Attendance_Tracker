'use client'

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  MapPin,
  XCircle,
  AlertTriangle,
  FileText, // Used for disputes
  BookOpen,
  MoreHorizontal,
  Target,
  HelpCircle, // Used for disputes
} from "lucide-react";

export default function StudentAttendanceView() {
  // 1. STATE: Track which tab is active
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'absent', 'disputed'

  // 2. DATA: The raw data for the list
  const attendanceData = [
    {
      id: 1,
      course: "Physics 101",
      prof: "Prof. Davis",
      room: "Lecture Hall A",
      date: "Nov 14, 2023",
      time: "09:14 AM",
      status: "Present", // Present, Late, Absent, Disputed
      signal: "High",
      gps: "GPS Verified",
      icon: BookOpen,
      colorClass: "indigo",
    },
    {
      id: 2,
      course: "Chemistry 201",
      prof: "Prof. Miller",
      room: "Lab B",
      date: "Nov 13, 2023",
      time: "11:13 AM",
      status: "Late",
      signal: "8m",
      gps: "Accuracy",
      icon: BookOpen,
      colorClass: "indigo",
    },
    {
      id: 3,
      course: "Calculus II",
      prof: "Prof. Evans",
      room: "Room 304",
      date: "Nov 12, 2023",
      time: "No Check-in",
      status: "Absent",
      signal: "--",
      gps: "No Signal",
      icon: BookOpen,
      colorClass: "indigo",
    },
    // New Record specific for "Disputes" tab
    {
      id: 4,
      course: "Art History 105",
      prof: "Prof. Klein",
      room: "Studio 4",
      date: "Nov 10, 2023",
      time: "Pending Review",
      status: "Disputed",
      signal: "Appeal",
      gps: "Manual Review",
      icon: FileText,
      colorClass: "blue",
    },
  ];

  // 3. FILTER LOGIC: Filter data based on activeTab
  const filteredData = attendanceData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "absent") return item.status === "Absent";
    if (activeTab === "disputed") return item.status === "Disputed";
    return true;
  });

  // Helper to map icons to summary labels (kept from your original code)
  const getIcon = (label: string, size: number = 20) => {
    switch (label) {
      case "Attendance Rate":
        return <Target size={size} />;
      case "Classes Missed":
        return <XCircle size={size} />;
      case "Late Arrivals":
        return <Clock size={size} />;
      case "Excused":
        return <FileText size={size} />;
      default:
        return <CheckCircle2 size={size} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            My Attendance
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Welcome back, Alex. You are currently on track for the semester.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Calendar size={16} /> History
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95">
            <Download size={16} /> Download Log
          </button>
        </div>
      </div>

      {/* Summary Section (Kept Original) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-8 relative">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100/30 blur-[100px] -z-10 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-100/20 blur-[100px] -z-10 rounded-full" />

        {[
          {
            label: "Attendance Rate",
            val: "94%",
            sub: "Semester Goal: 85%",
            trend: "Good",
            color: "text-emerald-600",
            accent: "bg-emerald-500",
          },
          {
            label: "Classes Missed",
            val: "3",
            sub: "Total Sessions",
            trend: "Warning",
            color: "text-rose-600",
            accent: "bg-rose-500",
          },
          {
            label: "Late Arrivals",
            val: "2",
            sub: "Avg. 5 mins",
            trend: "Stable",
            color: "text-amber-600",
            accent: "bg-amber-500",
          },
          {
            label: "Excused",
            val: "1",
            sub: "Medical Leave",
            trend: "Approved",
            color: "text-blue-600",
            accent: "bg-blue-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative flex flex-col group cursor-default transition-all duration-300"
          >
            <div
              className={`h-1 w-12 rounded-full mb-6 transition-all duration-500 group-hover:w-20 ${stat.accent}`}
            />
            <div className="flex items-baseline gap-2">
              <h3
                className={`text-5xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform origin-left`}
              >
                {stat.val}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.trend === "Good" || stat.trend === "Approved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-500"} border`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-slate-800 tracking-wide uppercase text-[11px]">
                {stat.label}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium text-slate-500">{stat.sub}</p>
              </div>
            </div>
            <div
              className={`absolute -right-4 top-0 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all duration-500 ${stat.color}`}
            >
              {getIcon(stat.label, 80)}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              {activeTab === "disputed"
                ? "Open Disputes"
                : activeTab === "absent"
                  ? "Missed Classes"
                  : "My Recent Classes"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === "disputed"
                ? "Track the status of your attendance appeals"
                : "Check your recent check-ins and signal validity"}
            </p>
          </div>

          {/* TAB BUTTONS - Now Functional */}
          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "all"
                  ? "bg-white text-slate-800 border-slate-200 shadow-sm"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab("absent")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "absent"
                  ? "bg-white text-slate-800 border-slate-200 shadow-sm"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              Absences
            </button>
            <button
              onClick={() => setActiveTab("disputed")}
              className={`px-3 py-1.5 text-xs font-bold shadow-sm rounded-lg border transition-all ${
                activeTab === "disputed"
                  ? "bg-white text-slate-800 border-slate-200 shadow-sm"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              Disputes
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-12 md:col-span-4 pl-2">Course Info</div>
          <div className="hidden md:block col-span-3">Check-in Time</div>
          <div className="hidden md:block col-span-3">My Signal</div>
          <div className="col-span-12 md:col-span-2 text-right pr-2">
            Status
          </div>
        </div>

        {/* Rows - Now Dynamic */}
        <div className="divide-y divide-slate-100">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p>No records found for this filter.</p>
            </div>
          ) : (
            filteredData.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-12 px-8 py-5 items-center hover:bg-slate-50/50 transition-colors group cursor-pointer"
              >
                {/* Column 1: Course Info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-${record.colorClass}-50 border border-${record.colorClass}-100 flex items-center justify-center text-${record.colorClass}-600 shrink-0 group-hover:bg-${record.colorClass}-600 group-hover:text-white transition-all duration-300`}
                  >
                    <record.icon size={20} />
                  </div>
                  <div>
                    <p
                      className={`font-bold text-slate-800 text-base group-hover:text-${record.colorClass}-600 transition-colors`}
                    >
                      {record.course}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {record.room} • {record.prof}
                    </p>
                  </div>
                </div>

                {/* Column 2: Time */}
                <div className="col-span-6 md:col-span-3 mt-4 md:mt-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {record.date}
                    </span>
                    <span
                      className={`text-xs flex items-center gap-1.5 mt-1 font-medium ${
                        record.status === "Present"
                          ? "text-slate-500"
                          : record.status === "Late"
                            ? "text-amber-600 font-bold"
                            : record.status === "Disputed"
                              ? "text-blue-600 font-bold"
                              : "text-rose-500"
                      }`}
                    >
                      {record.status === "Present" && (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      )}
                      {record.status === "Late" && <Clock size={12} />}
                      {record.status === "Absent" && <XCircle size={12} />}
                      {record.status === "Disputed" && <HelpCircle size={12} />}
                      {record.status === "Disputed"
                        ? "Details Sent"
                        : record.status === "Absent"
                          ? "No Check-in"
                          : `Checked in: ${record.time}`}
                    </span>
                  </div>
                </div>

                {/* Column 3: Signal/GPS */}
                <div className="col-span-6 md:col-span-3 mt-4 md:mt-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                        record.status === "Disputed"
                          ? "bg-blue-50 border-blue-100"
                          : record.status === "Absent"
                            ? "bg-rose-50 border-rose-100"
                            : "bg-slate-100 border-slate-200"
                      }`}
                    >
                      <MapPin
                        size={14}
                        className={
                          record.status === "Present"
                            ? "text-emerald-500"
                            : record.status === "Disputed"
                              ? "text-blue-500"
                              : record.status === "Absent"
                                ? "text-rose-400"
                                : "text-slate-500"
                        }
                      />
                      <span
                        className={`text-xs font-mono font-bold ${
                          record.status === "Disputed"
                            ? "text-blue-700"
                            : record.status === "Absent"
                              ? "text-rose-700"
                              : "text-slate-700"
                        }`}
                      >
                        {record.signal}
                      </span>
                    </div>
                    {record.status === "Absent" ? (
                      <button className="text-[11px] text-indigo-600 font-bold hover:underline">
                        Appeal?
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {record.gps}
                      </span>
                    )}
                  </div>
                </div>

                {/* Column 4: Status Badge */}
                <div className="col-span-12 md:col-span-2 text-right mt-4 md:mt-0 flex md:justify-end justify-between items-center">
                  <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </span>

                  {/* Logic for Status Badge Rendering */}
                  {record.status === "Present" && (
                    <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold shadow-sm">
                      <CheckCircle2
                        size={14}
                        className="fill-emerald-600 text-white"
                      />{" "}
                      Present
                    </span>
                  )}
                  {record.status === "Late" && (
                    <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-xs font-bold shadow-sm">
                      <AlertTriangle
                        size={14}
                        className="fill-amber-500 text-white"
                      />{" "}
                      Late
                    </span>
                  )}
                  {record.status === "Absent" && (
                    <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200 text-xs font-bold shadow-sm">
                      <XCircle size={14} className="fill-rose-500 text-white" />{" "}
                      Absent
                    </span>
                  )}
                  {record.status === "Disputed" && (
                    <span className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-bold shadow-sm">
                      <HelpCircle
                        size={14}
                        className="fill-blue-500 text-white"
                      />{" "}
                      Reviewing
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-center">
          <button className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            Load More Records <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
