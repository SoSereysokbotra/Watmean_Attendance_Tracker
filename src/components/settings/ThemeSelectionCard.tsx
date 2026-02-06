"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";

export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-foreground tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground mt-2">{description}</p>
    <div className="h-px w-full bg-border mt-4" />
  </div>
);

export const ThemeSelectionCard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
      color: "text-amber-500",
      bgClass: "bg-gray-100",
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      color: "text-blue-400",
      bgClass: "bg-gray-900",
    },
    {
      id: "system",
      label: "System",
      icon: Laptop,
      color: "text-muted-foreground",
      bgClass: "bg-gradient-to-br from-gray-100 to-gray-900",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Appearance"
        description="Customize how the application looks on your device."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`group relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
              theme === t.id
                ? "border-brand-primary bg-brand-primary/5 ring-0"
                : "border-border hover:border-border/80 hover:bg-muted/30"
            }`}
          >
            <div
              className={`w-full aspect-[16/10] ${t.bgClass} rounded-lg mb-4 overflow-hidden border border-border shadow-sm relative flex items-center justify-center`}
            >
              {/* Simple skeletal preview for visuals */}
              {t.id !== "system" && (
                <div className="absolute top-3 left-3 right-3 space-y-2 opacity-30">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  <div className="h-2 w-3/4 bg-current rounded" />
                </div>
              )}
              {t.id === "system" && (
                <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border">
                  <Laptop size={24} className="text-foreground" />
                </div>
              )}
              {theme === t.id && (
                <div className="absolute bottom-2 right-2 bg-brand-primary text-white rounded-full p-1 shadow-md animate-in zoom-in-50">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <t.icon size={18} className={t.color} />
              {t.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
