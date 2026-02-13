"use client";

import React, { useState, useEffect } from "react";
import { User, Globe, Loader2 } from "lucide-react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ThemeSelectionCard } from "@/components/settings/ThemeSelectionCard";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
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
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        alert("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
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
  const adminData = profile
    ? {
        fullName: profile.fullName,
        email: profile.email,
        phone: "N/A", // API doesn't have phone yet
        major: "Administrator", // Not applicable for admin but keeping structure
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
      description="Manage your admin account and app preferences."
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "profile" && (
        <UserProfileSettings
          role="Admin"
          userId={profile ? profile.id.substring(0, 8).toUpperCase() : ""}
          userData={adminData}
          onSave={handleSaveProfile}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
