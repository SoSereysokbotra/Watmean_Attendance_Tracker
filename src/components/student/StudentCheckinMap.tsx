"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface StudentCheckinMapProps {
  position: [number, number] | null;
  targetLocation: [number, number];
  attendanceRadius: number;
  triggerCenterUser: number;
  triggerCenterTarget: number;
}

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

const createIcon = (color: string) => {
  if (typeof window === "undefined") return null;
  return new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export default function StudentCheckinMap({
  position,
  targetLocation,
  attendanceRadius,
  triggerCenterUser,
  triggerCenterTarget,
}: StudentCheckinMapProps) {
  useEffect(() => {
    // Fix for default marker icons in Leaflet
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const userIcon = createIcon("var(--brand-primary)");
  const targetIcon = createIcon("#ef4444");

  return (
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

      {targetIcon && (
        <Marker position={targetLocation} icon={targetIcon}>
          <Popup>Classroom 304</Popup>
        </Marker>
      )}

      <Circle
        center={targetLocation}
        radius={attendanceRadius}
        pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.1 }}
      />

      {position && userIcon && (
        <>
          <Marker position={position} icon={userIcon}>
            <Popup>You</Popup>
          </Marker>
          <Polyline
            positions={[position, targetLocation]}
            color="var(--brand-primary)"
            dashArray="5, 10"
          />
        </>
      )}
    </MapContainer>
  );
}
