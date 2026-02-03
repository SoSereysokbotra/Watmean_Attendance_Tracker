"use client";

import Link from "next/link";
import { TrendingUp, Clock, ArrowRight, MapPin } from "lucide-react";
import { div } from "framer-motion/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, Sarah!
          </h1>
          <p className="text-slate-500 mt-2">
            You have{" "}
            <span className="font-semibold text-brand-primary">2 classes</span>{" "}
            scheduled for today.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-500">Current Session</p>
          <p className="text-xl font-bold text-slate-900">Fall Semester 2024</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Overall Attendance (White Style) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            {/* Icon Background adapted for Light Mode */}
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              +4%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Overall Attendance
          </p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">89%</h3>
        </div>

        <div
          className="bg-brand-dark text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer"
          onClick={() => router.push("/student/checkin")}
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-white/80">
              <Clock size={20} />
              <span className="text-sm font-medium">Next Class • 14:00</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Physics 101</h3>
            <p className="text-white/60 text-sm">Room 304 • Prof. Davis</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-primary bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/10">
              <MapPin size={14} /> Check In
            </div>
          </div>
        </div>

        {/* Card 3: Placeholder for layout balance */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
          <p className="text-slate-400 text-sm">No other alerts</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-6">
          Today's Schedule
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 text-center">
              <span className="block text-sm font-bold text-slate-900">
                09:00
              </span>
              <span className="block text-xs text-slate-500">AM</span>
            </div>
            <div className="h-10 w-1 bg-green-500 rounded-full"></div>
            <div>
              <h4 className="font-bold text-slate-800">Computer Science 101</h4>
              <p className="text-xs text-slate-500">
                Lecture Hall A • Attended
              </p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              Present
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-16 text-center">
              <span className="block text-sm font-bold text-slate-900">
                14:00
              </span>
              <span className="block text-xs text-slate-500">PM</span>
            </div>
            <div className="h-10 w-1 bg-gray-300 rounded-full"></div>
            <div>
              <h4 className="font-bold text-slate-800">Physics 101</h4>
              <p className="text-xs text-slate-500">Room 304 • Upcoming</p>
            </div>
            <Link
              href="/checkin"
              className="ml-auto px-4 py-1.5 border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary text-xs font-bold rounded-lg transition-colors"
            >
              Check In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
