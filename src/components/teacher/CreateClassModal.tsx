"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  UserPlus,
  Check,
  Loader2,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { CSVUploadField } from "@/components/teacher/CSVUploadField";
import dynamic from "next/dynamic";

const TeacherLocationPicker = dynamic(
  () => import("@/components/teacher/TeacherLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">
        Loading Map...
      </div>
    ),
  },
);

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "", // Subject Code
    semester: "",
    room: "",
    schedule: "",
    description: "",
    lat: 11.5564, // Default PP
    lng: 104.9282,
    radius: 50,
  });
  const [studentEmails, setStudentEmails] = useState<string[]>([]);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [manualEmails, setManualEmails] = useState("");

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Parse manual emails
      const manualList = manualEmails
        .split(/[\n,]/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      const combinedEmails = [...studentEmails, ...manualList];

      const response = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentEmails: combinedEmails,
          csvContent,
          sendInvitations: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      onClose();
      // Ideally trigger refresh or toast success
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/30 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-border animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border px-8 py-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {step === 1
                ? "Create New Class"
                : step === 2
                  ? "Set Class Location"
                  : "Invite Students"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Enter class details below."
                : step === 2
                  ? "Set determining location for student check-ins."
                  : "Add students to your class roster."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Adv Web Dev"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subject Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. CS-402"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Fall 2024"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Room
                  </label>
                  <Input
                    placeholder="e.g. 304"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Schedule
                </label>
                <Input
                  placeholder="e.g. Mon, Wed 10:00 - 11:30"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </label>
                <Input
                  placeholder="Optional class description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Geofence Location & Radius
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Radius: {formData.radius}m
                  </span>
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border">
                  <TeacherLocationPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    onLocationSelect={(lat, lng) =>
                      setFormData({ ...formData, lat, lng })
                    }
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Radius (Meters)
                  </label>
                  <Input
                    type="number"
                    value={formData.radius}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        radius: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <Info className="h-3 w-3" /> Students must be within this
                  radius to verify attendance.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Import from CSV
                </label>
                <CSVUploadField
                  onEmailsParsed={(emails) => setStudentEmails(emails)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Or Enter Manually
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  placeholder="Enter student emails separated by commas or new lines..."
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 border-t border-border bg-muted/30 px-8 py-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
              disabled={
                step === 1 &&
                (!formData.name || !formData.code || !formData.semester)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
