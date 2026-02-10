"use client";

import React, { useState, useEffect } from "react";
import { User, Globe } from "lucide-react";
import { SettingsLayout } from "../../../../components/settings/SettingsLayout";
import { ThemeSelectionCard } from "../../../../components/settings/ThemeSelectionCard";
import {
  UserProfileSettings,
  type ProfileData,
} from "../../../../components/settings/UserProfileSettings";

export default function StudentSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<any>(null);

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
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

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
          userId={userData.studentId || "Not Assigned"}
          userData={{
            fullName: userData.name || userData.fullName || "",
            email: userData.email,
            phone: userData.phone || "",
            major: userData.major || "Computer Science",
          }}
          onSave={async (data: ProfileData) => {
            // We can implement API call inside UserProfileSettings or here.
            // If UserProfileSettings expects an onSave prop, we pass it.
            // Assuming UserProfileSettings handles UI, we just need the API call.

            try {
              const response = await fetch("/api/student/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              if (!response.ok) throw new Error("Failed to update profile");

              // Optimistic update or refetch
              setUserData({ ...userData, ...data });
              alert("Profile updated successfully!");
            } catch (err) {
              console.error(err);
              alert("Failed to update profile.");
            }
          }}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
