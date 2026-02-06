"use client";

import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsLayoutProps {
  title: string;
  description: string;
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  children: React.ReactNode;
}

export const SettingsLayout = ({
  title,
  description,
  menuItems,
  activeTab,
  setActiveTab,
  children,
}: SettingsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-brand-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={
                        activeTab === item.id
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }
                    />
                    {item.label}
                  </div>
                  {activeTab === item.id && (
                    <ChevronRight size={14} className="opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full bg-card rounded-3xl shadow-sm border border-border min-h-[200px] p-10 relative">
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
