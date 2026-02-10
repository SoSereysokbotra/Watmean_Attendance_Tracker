"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Loader2, Info, Target } from "lucide-react";
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

export default function LiveMapView() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [triggerCenterUser, setTriggerCenterUser] = useState(0);
  const [triggerCenterTarget, setTriggerCenterTarget] = useState(0);

  const targetLocation: [number, number] = [12.5657, 104.991];
  const ATTENDANCE_RADIUS = 100;

  const distance = useMemo(() => {
    if (!position) return null;
    return getDistance(
      position[0],
      position[1],
      targetLocation[0],
      targetLocation[1],
    );
  }, [position]);

  const isWithinRange = distance !== null && distance <= ATTENDANCE_RADIUS;

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

  return (
    <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative flex flex-col group">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <StudentCheckinMap
          position={position}
          targetLocation={targetLocation}
          attendanceRadius={ATTENDANCE_RADIUS}
          triggerCenterUser={triggerCenterUser}
          triggerCenterTarget={triggerCenterTarget}
        />

        {/* Loading Overlay */}
        {!position && !error && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[500] flex items-center justify-center flex-col gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
            <p className="text-sm font-medium text-muted-foreground">
              Acquiring GPS Signal...
            </p>
          </div>
        )}

        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[500] flex items-center justify-center flex-col gap-3">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Checked In!</h3>
            <p className="text-muted-foreground">
              You have successfully marked your attendance.
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-4 px-6 py-2 bg-brand-primary text-primary-foreground rounded-lg"
            >
              Close
            </button>
          </div>
        )}

        {/* Error Overlay (if checkin fail) */}
        {error && !success && position && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-rose-50 dark:bg-rose-900/90 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-200 px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-0.5 z-[1000]">
          <div className="bg-card/80 backdrop-blur-md rounded-xl border border-border shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-bold text-foreground">
                  Check In: Classroom 304
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
      <div className="bg-card p-4 border-t border-border flex justify-between items-center z-[1000]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info size={14} />
          <span>Distance: {distance ? `${distance}m` : "--"}</span>
        </div>
        <button
          disabled={!isWithinRange || loading || !!success}
          onClick={handleCheckIn}
          className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
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
