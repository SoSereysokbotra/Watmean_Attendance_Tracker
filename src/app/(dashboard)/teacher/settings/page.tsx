"use client";

import React, { useState, useEffect } from "react";
import { User, Globe, Loader2 } from "lucide-react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ThemeSelectionCard } from "@/components/settings/ThemeSelectionCard";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";

export default function TeacherSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/teacher/settings");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Fallback if no profile
  const teacherData = profile
    ? {
        fullName: profile.fullName,
        email: profile.email,
        phone: "N/A", // API doesn't have phone yet
        major: "Teacher", // Default or fetch if available
        teacherId: profile.teacherId,
      }
    : {
        fullName: "",
        email: "",
        phone: "",
        major: "",
      };

  return (
    <SettingsLayout
      title="Settings"
      description="Manage your teacher account and app preferences."
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "profile" && (
        <UserProfileSettings
          role="Teacher"
          userId={profile?.id || ""}
          userData={teacherData}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
