"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Loader2, Info, Target, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const StudentCheckinMap = dynamic(
  () => import("@/components/student/StudentCheckinMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
        Loading Map...
      </div>
    ),
  },
);

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

interface ActiveSession {
  sessionId: string;
  classId: string;
  className: string;
  classCode: string;
  room: string;
  startTime: string;
  endTime: string;
  geofence: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export default function LiveMapView() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [loadingSession, setLoadingSession] = useState(true);

  const [triggerCenterUser, setTriggerCenterUser] = useState(0);
  const [triggerCenterTarget, setTriggerCenterTarget] = useState(0);

  // Fetch active session on mount
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const query = classId ? `?classId=${classId}` : "";
        const response = await fetch(`/api/student/active-session${query}`);
        const data = await response.json();
        setActiveSession(data.activeSession);
      } catch (err) {
        console.error("Failed to fetch active session:", err);
      } finally {
        setLoadingSession(false);
      }
    };

    fetchActiveSession();
  }, [classId]);

  const targetLocation: [number, number] | null = activeSession
    ? [activeSession.geofence.lat, activeSession.geofence.lng]
    : null;
  const attendanceRadius = activeSession?.geofence.radius || 100;

  const distance = useMemo(() => {
    if (!position || !targetLocation) return null;
    return getDistance(
      position[0],
      position[1],
      targetLocation[0],
      targetLocation[1],
    );
  }, [position, targetLocation]);

  const isWithinRange = distance !== null && distance <= attendanceRadius;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!position) {
      setError("GPS signal not acquired.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/student/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: position[0],
          longitude: position[1],
          classId: classId, // Include classId to check into specific class
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Check-in failed");
      }

      setSuccess("Checked in successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching session
  if (loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Show "no active session" message
  if (!activeSession) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div
          className="bg-muted/30 p-6 rounded-full mb-6 animate-in scale-in-95 duration-500 fill-mode-both"
          style={{ animationDelay: "100ms" }}
        >
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold text-foreground mb-2 animate-in slide-in-from-top-4 duration-500 fill-mode-both"
          style={{ animationDelay: "200ms" }}
        >
          No Active Session
        </h2>
        <p
          className="text-muted-foreground max-w-md animate-in fade-in duration-500 fill-mode-both"
          style={{ animationDelay: "300ms" }}
        >
          There are no active attendance sessions at the moment. Your teacher
          needs to launch a session before you can check in.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative flex flex-col group animate-in fade-in duration-700">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <StudentCheckinMap
          position={position}
          targetLocation={targetLocation!}
          attendanceRadius={attendanceRadius}
          triggerCenterUser={triggerCenterUser}
          triggerCenterTarget={triggerCenterTarget}
        />

        {/* Loading Overlay */}
        {!position && !error && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[500] flex items-center justify-center flex-col gap-3 animate-in fade-in duration-500">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
            <p className="text-sm font-medium text-muted-foreground">
              Acquiring GPS Signal...
            </p>
          </div>
        )}

        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[500] flex items-center justify-center flex-col gap-3 animate-in fade-in duration-500">
            <div
              className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 animate-in scale-in-95 duration-500 fill-mode-both"
              style={{ animationDelay: "100ms" }}
            >
              <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3
              className="text-xl font-bold text-foreground animate-in slide-in-from-top-4 duration-500 fill-mode-both"
              style={{ animationDelay: "150ms" }}
            >
              Checked In!
            </h3>
            <p
              className="text-muted-foreground animate-in fade-in duration-500 fill-mode-both"
              style={{ animationDelay: "200ms" }}
            >
              You have successfully marked your attendance.
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-4 px-6 py-2 bg-brand-primary text-primary-foreground rounded-lg hover:scale-105 active:scale-95 duration-300 animate-in fade-in duration-500 fill-mode-both"
              style={{ animationDelay: "250ms" }}
            >
              Close
            </button>
          </div>
        )}

        {/* Error Overlay (if checkin fail) */}
        {error && !success && position && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-rose-50 dark:bg-rose-900/90 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-200 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-top-4 duration-500 fill-mode-both">
            {error}
          </div>
        )}

        {/* Top Bar */}
        <div
          className="absolute top-0 left-0 right-0 p-0.5 z-[1000] animate-in slide-in-from-top-4 duration-700 fill-mode-both"
          style={{ animationDelay: "100ms" }}
        >
          <div className="bg-card/80 backdrop-blur-md rounded-xl border border-border shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-bold text-foreground">
                  Check In: {activeSession.className}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeSession.room} • Code: {activeSession.classCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTriggerCenterUser(triggerCenterUser + 1)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <MapPin size={16} />
                </button>
                <button
                  onClick={() =>
                    setTriggerCenterTarget(triggerCenterTarget + 1)
                  }
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Target size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="bg-card p-4 border-t border-border flex justify-between items-center z-[1000] animate-in slide-in-from-bottom-6 duration-700 fill-mode-both"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info size={14} />
          <span>
            Distance: {distance ? `${distance}m` : "--"} / {attendanceRadius}m
          </span>
        </div>
        <button
          disabled={!isWithinRange || loading || !!success}
          onClick={handleCheckIn}
          className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 duration-300 ${
            isWithinRange && !loading && !success
              ? "bg-brand-primary text-primary-foreground hover:bg-brand-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {loading
            ? "Checking In..."
            : isWithinRange
              ? "Check In Now"
              : "Move Closer"}{" "}
          <MapPin size={16} />
        </button>
      </div>
    </div>
  );
}
