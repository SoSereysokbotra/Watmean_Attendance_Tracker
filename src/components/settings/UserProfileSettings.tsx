"use client";

import React from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  major: string;
  profileImage?: string;
}

interface UserProfileProps {
  role: "Student" | "Teacher" | "Admin" | string;
  userId: string; // Internal UUID for API calls
  displayId?: string; // Formatted ID for display
  userData: ProfileData;
  onSave?: (data: ProfileData) => Promise<void>;
  isLoading?: boolean;
}

export const UserProfileSettings = ({
  role,
  userId,
  displayId,
  userData,
  onSave,
  isLoading = false,
}: UserProfileProps) => {
  const [formData, setFormData] = React.useState(userData);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Upload via backend endpoint
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("userId", userId);

      const uploadResponse = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Upload failed");
      }

      const { secure_url } = await uploadResponse.json();

      // Update backend
      const updateResponse = await fetch("/api/users/profile-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageUrl: secure_url }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to save profile image reference");
      }

      // Update state
      setFormData((prev) => ({
        ...prev,
        profileImage: secure_url,
      }));

      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-border -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-8 animate-slide-down">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Profile Information
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your personal details and public profile visibility.
        </p>
      </div>

      <div className="space-y-8 animate-slide-up">
        {/* Avatar Section */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in-scale"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={isUploading || isLoading}
          />

          {/* Profile Image */}
          <div
            className={`relative group cursor-pointer transition-transform duration-300 ${
              isUploading || isLoading
                ? "pointer-events-none opacity-70"
                : "hover:scale-105"
            }`}
            onClick={() =>
              !isUploading && !isLoading && fileInputRef.current?.click()
            }
          >
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-sm"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-3xl font-bold border-4 border-background shadow-sm overflow-hidden">
                <span className="group-hover:opacity-25 transition-opacity duration-200">
                  {initials}
                </span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-[3px] border-background" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
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
                {displayId || userId}
              </span>
            </p>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Form Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          style={{ animation: "slide-up 0.5s ease-out 0.2s both" }}
        >
          <div className="md:col-span-2 transition-all duration-300 hover:scale-[1.02]">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background hover:bg-muted/10 transition-all duration-300 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:scale-[1.02]"
            />
          </div>

          <div className="md:col-span-2 transition-all duration-300 hover:scale-[1.02]">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-lg border border-input bg-muted/20 text-foreground text-sm focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="md:col-span-2 transition-all duration-300 hover:scale-[1.02]">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              Major / Course
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              readOnly
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-lg border border-input bg-muted/20 text-foreground text-sm focus:outline-none transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Footer with responsive padding and negative margins */}
      <div
        className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t border-border -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8 mt-8 flex items-center justify-end gap-3 rounded-b-3xl bg-muted/20 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={() => setFormData(userData)}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
};
