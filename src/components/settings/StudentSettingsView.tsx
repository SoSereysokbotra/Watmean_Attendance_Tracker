"use client";

import React, { useState } from "react";
import { User, Bell, Shield, LogOut, Globe, Moon } from "lucide-react";

// Components
const Toggle = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
      enabled ? "bg-indigo-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`}
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
  <div className="mb-6">
    <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

export default function StudentSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your account and app preferences.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={
                      activeTab === item.id
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] p-8 relative">
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                <SectionHeader
                  title="Profile Information"
                  description="Update your personal details."
                />
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold border-4 border-white shadow-sm">
                    SA
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      Sarah Anderson
                    </h4>
                    <p className="text-sm text-gray-500">
                      Student ID: 202400123
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <SectionHeader
                  title="Notifications"
                  description="Manage how you receive alerts."
                />
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <span>Email Notifications</span>
                  <Toggle enabled={emailNotifs} setEnabled={setEmailNotifs} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <span>Push Notifications</span>
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
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <span>Biometric Login</span>
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
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-2">
                    <Moon size={18} /> <span>Dark Mode</span>
                  </div>
                  <Toggle enabled={darkMode} setEnabled={setDarkMode} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
