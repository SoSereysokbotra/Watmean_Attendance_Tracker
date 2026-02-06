"use client";

import React from "react";
import { Search, Filter, ArrowRight, Calendar, MapPin } from "lucide-react";

const classes = [
  {
    id: 1,
    name: "Physics 101",
    prof: "Dr. Davis",
    room: "304",
    schedule: "Mon, Wed 14:00",
    progress: 75,
    colorTheme: "brand-primary",
  },
  {
    id: 2,
    name: "Chemistry 201",
    prof: "Prof. Johnson",
    room: "Lab B",
    schedule: "Tue, Thu 10:00",
    progress: 60,
    colorTheme: "emerald",
  }
];

const getColorStyles = (theme: string) => {
  const styles: Record<
    string,
    { bg: string; text: string; light: string; bar: string }
  > = {
    "brand-primary": {
      bg: "bg-brand-primary",
      text: "text-brand-primary",
      light: "bg-brand-primary/10",
      bar: "bg-brand-primary",
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-700 dark:text-emerald-400",
      light: "bg-emerald-50 dark:bg-emerald-900/20",
      bar: "bg-emerald-500",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-700 dark:text-purple-400",
      light: "bg-purple-50 dark:bg-purple-900/20",
      bar: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-700 dark:text-orange-400",
      light: "bg-orange-50 dark:bg-orange-900/20",
      bar: "bg-orange-500",
    },
  };
  return styles[theme] || styles["brand-primary"];
};

export default function ClassesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            My Courses
          </h2>
          <p className="text-muted-foreground mt-1">
            Current semester progress and enrollment
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl text-sm font-semibold hover:bg-muted hover:border-border/80 transition-all">
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
              className="bg-card rounded-3xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                {cls.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{cls.prof}</p>

              {/* Schedule and Room Section */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar size={16} className="text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Schedule
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {cls.schedule}
                  </p>
                </div>
                <div className="flex-1 bg-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin size={16} className="text-rose-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Room
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {cls.room}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary-foreground hover:bg-brand-primary transition-all duration-300">
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
