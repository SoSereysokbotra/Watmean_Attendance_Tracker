"use client";

import React from "react";
import { Camera, User, Mail, Phone, GraduationCap } from "lucide-react";

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  major: string;
}

interface UserProfileProps {
  role: "Student" | "Teacher" | "Admin" | string;
  userId: string;
  userData: ProfileData;
  onSave?: (data: ProfileData) => Promise<void>;
}

export const UserProfileSettings = ({
  role,
  userId,
  userData,
  onSave,
}: UserProfileProps) => {
  const [formData, setFormData] = React.useState(userData);

  React.useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const initials = (formData.fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Header with responsive padding and negative margins */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-border -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Profile Information
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your personal details and public profile visibility.
        </p>
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="h-24 w-24 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-3xl font-bold border-4 border-background shadow-sm overflow-hidden">
              <span className="group-hover:opacity-25 transition-opacity duration-200">
                {initials}
              </span>
            </div>
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-[3px] border-background" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-2xl text-foreground">
                {formData.fullName || "Loading..."}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold">
                {role}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {role} ID:{" "}
              <span className="font-mono text-foreground font-medium">
                {userId}
              </span>
            </p>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              readOnly
              className="w-full h-11 px-4 rounded-lg border border-input bg-muted/20 text-foreground text-sm focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full h-11 px-4 rounded-lg border border-input bg-muted/20 text-foreground text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background hover:bg-muted/10 transition-colors text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              Major / Course
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background hover:bg-muted/10 transition-colors text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Footer with responsive padding and negative margins */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t border-border -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8 mt-8 flex items-center justify-end gap-3 rounded-b-3xl bg-muted/20">
        <button
          onClick={() => setFormData(userData)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </div>
    </>
  );
};
