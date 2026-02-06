"use client";

import React, { useState } from "react";
import { User, Globe } from "lucide-react";
import { SettingsLayout } from "../../../../components/settings/SettingsLayout";
import { ThemeSelectionCard } from "../../../../components/settings/ThemeSelectionCard";
import { UserProfileSettings } from "../../../../components/settings/UserProfileSettings";

export default function TeacherSettingsView() {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  const teacherData = {
    fullName: "Username123",
    email: "Username123@gmail.com",
    phone: "1234567890",
    major: "Computer Science",
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
          userId="20245592"
          userData={teacherData}
        />
      )}

      {activeTab === "preferences" && <ThemeSelectionCard />}
    </SettingsLayout>
  );
}
