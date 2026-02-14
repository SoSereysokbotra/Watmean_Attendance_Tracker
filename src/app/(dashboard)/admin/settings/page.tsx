"use client";

import React, { useState, useEffect } from "react";
import { User, Globe, Loader2 } from "lucide-react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ThemeSelectionCard } from "@/components/settings/ThemeSelectionCard";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";
import { toast } from "sonner"; // Import Sonner

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Track saving state

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
      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("An error occurred while fetching settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData: any) => {
    setIsSaving(true);
    // Optional: show a "saving" toast
    const promise = fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    toast.promise(promise, {
      loading: "Updating your profile...",
      success: (response) => {
        if (!response.ok) throw new Error();
        return "Profile updated successfully";
      },
      error: "Failed to update profile",
    });

    try {
      const response = await promise;
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
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
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          <p className="text-muted-foreground text-sm animate-pulse">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  // Fallback if no profile
  const adminData = {
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: "N/A",
    major: "Administrator",
    profileImage: profile?.profileImage || "",
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
          userId={profile?.id || ""}
          displayId={profile ? profile.id.substring(0, 8).toUpperCase() : ""}
          userData={adminData}
          onSave={handleSaveProfile}
          isLoading={isSaving} // Pass loading state to the form if it supports it
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
