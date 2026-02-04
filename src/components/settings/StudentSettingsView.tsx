"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Mail,
  Phone,
  GraduationCap,
  CheckCircle2,
  PenLine,
  Circle,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes"; // Assuming you're using next-themes

// --- Components ---

const Toggle = ({
  enabled,
  setEnabled,
  disabled = false,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    onClick={() => !disabled && setEnabled(!enabled)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
      enabled ? "bg-brand-primary" : "bg-muted"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`${
        enabled ? "translate-x-6" : "translate-x-1"
      } inline-block h-4 w-4 transform rounded-full bg-primary-foreground shadow-sm transition-transform duration-300`}
    />
  </button>
);

const SectionHeader = ({
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
    <div className="h-px w-full bg-border mt-4"></div>
  </div>
);

const ProfileField = ({
  label,
  value,
  icon: Icon,
  isCheckbox = false,
  isChecked = false,
  isEditable = false,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  isCheckbox?: boolean;
  isChecked?: boolean;
  isEditable?: boolean;
}) => (
  <div className="group flex items-center gap-5 p-4 rounded-2xl border border-border bg-card hover:border-brand-primary/30 transition-all duration-200">
    <div className="flex-shrink-0">
      <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
        {Icon ? <Icon size={20} /> : <User size={20} />}
      </div>
    </div>

    <div className="flex-grow min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-foreground truncate">
          {value}
        </span>

        {isCheckbox && (
          <div
            className="flex items-center"
            title={isChecked ? "Verified" : "Unverified"}
          >
            {isChecked ? (
              <CheckCircle2
                size={16}
                className="text-green-500 fill-green-500/10"
              />
            ) : (
              <Circle size={16} className="text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    </div>

    {isEditable && (
      <button className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
        <PenLine size={18} />
      </button>
    )}
  </div>
);

// Theme Toggle Card Component
const ThemeToggleCard = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  const isDark = theme === "dark";
  const isSystem = theme === "system";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
        <div className="flex items-center gap-2 text-foreground font-medium">
          {isDark ? (
            <Moon size={18} className="text-brand-primary" />
          ) : (
            <Sun size={18} className="text-amber-500" />
          )}
          <span>Dark Mode</span>
        </div>
        <Toggle
          enabled={isDark}
          setEnabled={(enabled) => setTheme(enabled ? "dark" : "light")}
        />
      </div>

      {/* System Theme Option */}
      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Globe size={18} className="text-muted-foreground" />
          <span>Use System Theme</span>
        </div>
        <Toggle
          enabled={isSystem}
          setEnabled={(enabled) => setTheme(enabled ? "system" : "light")}
        />
      </div>

      {/* Theme Preview */}
      <div className="mt-6 p-4 border border-border rounded-xl bg-card">
        <h4 className="font-medium text-foreground mb-3">Theme Preview</h4>
        <div className="flex gap-4">
          <div
            className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${theme === "light" ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-border/80"}`}
            onClick={() => setTheme("light")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-3 text-center text-xs font-medium text-foreground">
              Light
            </div>
          </div>

          <div
            className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${theme === "dark" ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-border/80"}`}
            onClick={() => setTheme("dark")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-700 rounded"></div>
              <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="mt-3 text-center text-xs font-medium text-foreground">
              Dark
            </div>
          </div>

          <div
            className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${theme === "system" ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-border/80"}`}
            onClick={() => setTheme("system")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-600"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-3/4"></div>
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-1/2"></div>
            </div>
            <div className="mt-3 text-center text-xs font-medium text-foreground">
              System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [biometric, setBiometric] = useState(true);

  // Theme management
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Simulate theme context - in real app, use next-themes or your theme provider
  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") || "light";
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "system") {
      setTheme(systemPrefersDark ? "dark" : "light");
    } else {
      setTheme(savedTheme);
    }
  }, []);

  // Update theme
  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply theme to document
    if (
      newTheme === "dark" ||
      (newTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Dispatch theme change event for other components
    window.dispatchEvent(new Event("themechange"));
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12 font-sans text-foreground">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 h-64 bg-muted rounded-2xl"></div>
              <div className="flex-1 h-[500px] bg-muted rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and app preferences.
            </p>
          </div>
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

          {/* Main Content */}
          <div className="flex-1 w-full bg-card rounded-3xl shadow-sm border border-border min-h-[500px] p-8 relative">
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <SectionHeader
                  title="Profile Information"
                  description="Update your personal details and public profile."
                />

                <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-dashed border-border flex items-center gap-5">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-brand-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-card">
                      SA
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 rounded-full border-4 border-card"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-foreground">
                      Username123
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      Student ID:{" "}
                      <span className="text-foreground">20245592</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <ProfileField
                      label="Full Name"
                      value="Username123"
                      icon={User}
                      isCheckbox={true}
                      isChecked={false}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ProfileField
                      label="Email Address"
                      value="Username123@gmail.com"
                      icon={Mail}
                      isCheckbox={true}
                      isChecked={true}
                    />
                  </div>

                  <ProfileField
                    label="Phone Number"
                    value="1234567890"
                    icon={Phone}
                    isEditable={true}
                  />

                  <ProfileField
                    label="Major / Course"
                    value="Computer Science"
                    icon={GraduationCap}
                    isEditable={true}
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <SectionHeader
                  title="Notifications"
                  description="Manage how you receive alerts."
                />
                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <span className="text-foreground font-medium">
                    Email Notifications
                  </span>
                  <Toggle enabled={emailNotifs} setEnabled={setEmailNotifs} />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <span className="text-foreground font-medium">
                    Push Notifications
                  </span>
                  <Toggle enabled={pushNotifs} setEnabled={setPushNotifs} />
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <SectionHeader
                  title="Security"
                  description="Manage login security."
                />
                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <span className="text-foreground font-medium">
                    Biometric Login
                  </span>
                  <Toggle enabled={biometric} setEnabled={setBiometric} />
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <SectionHeader
                  title="Preferences"
                  description="Customize your app experience."
                />

                <ThemeToggleCard theme={theme} setTheme={updateTheme} />

                {/* Additional Preferences */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="font-medium text-foreground mb-4">
                    Other Preferences
                  </h4>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <span className="text-foreground font-medium">
                      Compact View
                    </span>
                    <Toggle enabled={false} setEnabled={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl mt-4">
                    <span className="text-foreground font-medium">
                      Show Animations
                    </span>
                    <Toggle enabled={true} setEnabled={() => {}} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
