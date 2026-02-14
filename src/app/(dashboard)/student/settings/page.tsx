"use client";

import React, { useState, useEffect } from "react";
import { User, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SettingsLayout } from "../../../../components/settings/SettingsLayout";
import { ThemeSelectionCard } from "../../../../components/settings/ThemeSelectionCard";
import {
  UserProfileSettings,
  type ProfileData,
} from "../../../../components/settings/UserProfileSettings";

export default function StudentSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Reusing dashboard endpoint for user data or create dedicated get settings endpoint
        const response = await fetch("/api/student/dashboard");
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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

  return (
    <SettingsLayout
      title="Settings"
      description="Manage your student account and app preferences."
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "profile" && userData && (
        <UserProfileSettings
          role="Student"
          userId={userData?.id || ""}
          displayId={userData.studentId || "Not Assigned"}
          userData={{
            fullName: userData.name || userData.fullName || "",
            email: userData.email,
            phone: userData.phone || "",
            major: userData.major || "Computer Science",
            profileImage: userData.profileImage,
          }}
          onSave={async (data: ProfileData) => {
            try {
              const response = await fetch("/api/student/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              if (!response.ok) throw new Error("Failed to update profile");

              // Optimistic update or refetch
              setUserData({ ...userData, ...data });
              toast.success("Profile updated successfully!");
            } catch (err) {
              console.error(err);
              toast.error("Failed to update profile.");
            }
          }}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
