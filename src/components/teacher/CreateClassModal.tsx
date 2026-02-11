"use client";

import { useState, forwardRef } from "react";
import { X, Loader2, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { CSVUploadField } from "@/components/teacher/CSVUploadField";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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

// ----------------------------------------------------------------------
// 1. Custom Input Component (Preserves your exact UI style)
// ----------------------------------------------------------------------
const CustomTimeInput = forwardRef(
  ({ value, onClick, placeholder }: any, ref: any) => (
    <div className="relative w-full cursor-pointer group" onClick={onClick}>
      <Clock
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 group-hover:text-foreground transition-colors"
        size={14}
      />
      <input
        readOnly
        ref={ref}
        value={value}
        placeholder={placeholder || "--:--"}
        className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer hover:bg-muted/30 transition-colors caret-transparent"
      />
    </div>
  ),
);
CustomTimeInput.displayName = "CustomTimeInput";

// ----------------------------------------------------------------------
// 2. Helper to parse string "14:30" -> Date Object
// ----------------------------------------------------------------------
const parseTime = (timeStr: string) => {
  if (!timeStr) return null;
  const d = new Date();
  const [hours, minutes] = timeStr.split(":");
  d.setHours(Number(hours));
  d.setMinutes(Number(minutes));
  return d;
};

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

  // Schedule State Helper
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [scheduleTimes, setScheduleTimes] = useState({ start: "", end: "" });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const updateScheduleString = (days: string[], start: string, end: string) => {
    if (days.length === 0 || !start || !end) {
      setFormData((prev) => ({ ...prev, schedule: "" }));
      return;
    }
    const scheduleStr = `${days.join(", ")} ${start} - ${end}`;
    setFormData((prev) => ({ ...prev, schedule: scheduleStr }));
  };

  const toggleDay = (day: string) => {
    let newDays = [...scheduleDays];
    if (newDays.includes(day)) {
      newDays = newDays.filter((d) => d !== day);
    } else {
      newDays.push(day);
    }
    // Sort days
    newDays.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));

    setScheduleDays(newDays);
    updateScheduleString(newDays, scheduleTimes.start, scheduleTimes.end);
  };

  const handleTimeChange = (type: "start" | "end", value: string) => {
    const newTimes = { ...scheduleTimes, [type]: value };
    setScheduleTimes(newTimes);
    updateScheduleString(scheduleDays, newTimes.start, newTimes.end);
  };

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
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Class Schedule
                </label>
                <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                  {/* Days Selector */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Days
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                            scheduleDays.includes(day)
                              ? "bg-brand-primary text-primary-foreground shadow-md shadow-brand-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selector - UPDATED WITH REACT-DATEPICKER */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Time
                    </span>
                    <div className="flex items-center gap-3">
                      {/* Start Time */}
                      <div className="relative flex-1">
                        <DatePicker
                          selected={parseTime(scheduleTimes.start)}
                          onChange={(date: Date | null) => {
                            const newTime = date ? format(date, "HH:mm") : "";
                            handleTimeChange("start", newTime);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Start"
                          dateFormat="HH:mm"
                          placeholderText="Start"
                          customInput={<CustomTimeInput />}
                          wrapperClassName="w-full"
                        />
                      </div>

                      <span className="text-muted-foreground">-</span>

                      {/* End Time */}
                      <div className="relative flex-1">
                        <DatePicker
                          selected={parseTime(scheduleTimes.end)}
                          onChange={(date: Date | null) => {
                            const newTime = date ? format(date, "HH:mm") : "";
                            handleTimeChange("end", newTime);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End"
                          dateFormat="HH:mm"
                          placeholderText="End"
                          customInput={<CustomTimeInput />}
                          wrapperClassName="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
