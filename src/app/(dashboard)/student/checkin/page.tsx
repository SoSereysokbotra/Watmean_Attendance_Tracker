"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Loader2, Info, Target } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Icons
const createIcon = (color: string) =>
  new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const userIcon = createIcon("#3b82f6");
const targetIcon = createIcon("#ef4444");

// Helper: Haversine Distance
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

// Map Controller
function MapController({
  centerOnUser,
  centerOnTarget,
  userPos,
  targetPos,
}: {
  centerOnUser: boolean;
  centerOnTarget: boolean;
  userPos: [number, number] | null;
  targetPos: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    if (centerOnUser && userPos) map.flyTo(userPos, 18, { duration: 1.5 });
  }, [centerOnUser, userPos, map]);
  useEffect(() => {
    if (centerOnTarget) map.flyTo(targetPos, 18, { duration: 1.5 });
  }, [centerOnTarget, targetPos, map]);
  return null;
}

export default function LiveMapView() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Triggers
  const [triggerCenterUser, setTriggerCenterUser] = useState(0);
  const [triggerCenterTarget, setTriggerCenterTarget] = useState(0);

  const targetLocation: [number, number] = [11.510647000000002, 104.824125];
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

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden relative flex flex-col group">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={targetLocation}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController
            centerOnUser={!!triggerCenterUser}
            centerOnTarget={!!triggerCenterTarget}
            userPos={position}
            targetPos={targetLocation}
          />

          <Marker position={targetLocation} icon={targetIcon}>
            <Popup>Classroom 304</Popup>
          </Marker>
          <Circle
            center={targetLocation}
            radius={ATTENDANCE_RADIUS}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.1 }}
          />

          {position && (
            <>
              <Marker position={position} icon={userIcon}>
                <Popup>You</Popup>
              </Marker>
              <Polyline
                positions={[position, targetLocation]}
                color="blue"
                dashArray="5, 10"
              />
            </>
          )}
        </MapContainer>

        {/* Loading Overlay */}
        {!position && !error && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[500] flex items-center justify-center flex-col gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
            <p className="text-sm font-medium text-slate-600">
              Acquiring GPS Signal...
            </p>
          </div>
        )}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-0.5 z-[1000]">
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-bold text-slate-900">
                  Check In: Classroom 304
                </h2>
                <p className="text-sm text-slate-500">
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
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MapPin size={16} />
                </button>
                <button
                  onClick={() =>
                    setTriggerCenterTarget(triggerCenterTarget + 1)
                  }
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Target size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center z-[1000]">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={14} />
          <span>Distance: {distance ? `${distance}m` : "--"}</span>
        </div>
        <button
          disabled={!isWithinRange}
          className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
            isWithinRange
              ? "bg-brand-primary text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isWithinRange ? "Check In Now" : "Move Closer"} <MapPin size={16} />
        </button>
      </div>
    </div>
  );
}
