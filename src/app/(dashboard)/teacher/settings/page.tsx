"use client";

import React, { useState, useEffect } from "react";
import { User, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

  const handleSaveProfile = async (updatedData: any) => {
    try {
      const response = await fetch("/api/teacher/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        toast.success("Profile updated successfully!");
      } else {
        console.error("Failed to update profile");
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-border border-t-brand-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm animate-pulse">
            Loading your settings...
          </p>
        </div>
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
        profileImage: profile.profileImage,
      }
    : {
        fullName: "",
        email: "",
        phone: "",
        major: "",
      };

  // Helper function to format teacher ID
  const formatTeacherId = (id: string, teacherId?: string) => {
    // If backend already has a formatted teacherId, use it (though currently it might be null or raw UUID)
    // If we want to enforce the standard format TEA-YYYY-XXXX:

    // Use the first 4 chars of the UUID or ID
    const uniquePart = (teacherId || id || "").substring(0, 4).toUpperCase();
    const year = new Date().getFullYear();

    return `TEA-${year}-${uniquePart}`;
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
          displayId={
            profile ? formatTeacherId(profile.id, profile.teacherId) : ""
          }
          userData={teacherData}
          onSave={handleSaveProfile}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
