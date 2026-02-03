"use client";

import React from "react";
import { Search, Filter, ArrowRight, Calendar, MapPin } from "lucide-react";

const classes = [
  {
    id: 1,
    name: "Physics 101",
    code: "PHY-101",
    prof: "Dr. Davis",
    room: "304",
    schedule: "Mon, Wed 14:00",
    progress: 75,
    colorTheme: "blue",
  },
  {
    id: 2,
    name: "Chemistry 201",
    code: "CHM-201",
    prof: "Prof. Johnson",
    room: "Lab B",
    schedule: "Tue, Thu 10:00",
    progress: 60,
    colorTheme: "emerald",
  },
  {
    id: 3,
    name: "Calculus II",
    code: "MAT-202",
    prof: "Dr. Williams",
    room: "Hall C",
    schedule: "Fri 09:00",
    progress: 90,
    colorTheme: "purple",
  },
  {
    id: 4,
    name: "Art History",
    code: "ART-105",
    prof: "Ms. Glaire",
    room: "Studio 1",
    schedule: "Wed 16:00",
    progress: 40,
    colorTheme: "orange",
  },
];

const getColorStyles = (theme: string) => {
  const styles: Record<
    string,
    { bg: string; text: string; light: string; bar: string }
  > = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-700",
      light: "bg-blue-50",
      bar: "bg-blue-500",
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-700",
      light: "bg-emerald-50",
      bar: "bg-emerald-500",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-700",
      light: "bg-purple-50",
      bar: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-700",
      light: "bg-orange-50",
      bar: "bg-orange-500",
    },
  };
  return styles[theme] || styles.blue;
};

export default function ClassesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Courses
          </h2>
          <p className="text-slate-500 mt-1">
            Current semester progress and enrollment
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const colors = getColorStyles(cls.colorTheme);
          return (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl ${colors.light} flex items-center justify-center text-xl font-bold ${colors.text} mb-4`}
                >
                  {cls.code.split("-")[0]}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${colors.light} ${colors.text}`}
                >
                  {cls.code}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">
                {cls.name}
              </h3>
              <p className="text-sm text-slate-500 mb-6">{cls.prof}</p>

              {/* Schedule and Room Section */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar size={16} className="text-orange-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Schedule
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {cls.schedule}
                  </p>
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MapPin size={16} className="text-red-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Room
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{cls.room}</p>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-white hover:bg-slate-900 transition-all duration-300">
                  Continue Learning <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
