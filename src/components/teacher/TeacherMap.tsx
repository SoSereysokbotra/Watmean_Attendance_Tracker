"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Interface for the Zone data
interface Zone {
  id: number;
  name: string;
  room: string;
  radius: number;
  lat: number;
  lng: number;
  color: string;
  status: string;
}

interface TeacherMapProps {
  zones: Zone[];
  selectedId: number | null;
  onSelectZone: (id: number) => void;
}

// ---------------------------------------------------------
// Helper: Map Controller to handle "FlyTo" animations
// ---------------------------------------------------------
function MapController({ selectedZone }: { selectedZone: Zone | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (selectedZone) {
      map.flyTo([selectedZone.lat, selectedZone.lng], 17, {
        duration: 1.5,
      });
    }
  }, [selectedZone, map]);

  return null;
}

// ---------------------------------------------------------
// Helper: Create Custom Circular Icons (Copied from StudentCheckinMap)
// ---------------------------------------------------------
const createIcon = (color: string) => {
  if (typeof window === "undefined") return null;

  return new L.DivIcon({
    className: "custom-div-icon",
    // Exact HTML structure and styles from StudentCheckinMap
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export default function TeacherMap({
  zones,
  selectedId,
  onSelectZone,
}: TeacherMapProps) {
  // Fix Leaflet Default Icon Issue
  useEffect(() => {
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

  const selectedZone = zones.find((z) => z.id === selectedId);
  const defaultCenter: [number, number] = [11.5564, 104.9282];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapController selectedZone={selectedZone} />

      {zones.map((zone) => {
        const isSelected = selectedId === zone.id;

        // Color Logic:
        // Selected = #ef4444 (Red - matches Student "Target")
        // Unselected = var(--brand-primary) (Blue - matches Student "User") or Gray
        const color = isSelected ? "#ef4444" : "#9ca3af";

        const icon = createIcon(color);

        return (
          <React.Fragment key={zone.id}>
            {/* Geofence Circle - Matches StudentCheckinMap styling */}
            <Circle
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: isSelected ? 0.1 : 0.05, // 0.1 matches student map
                weight: isSelected ? 1 : 1, // Student map default is usually thin or relies on fill
                dashArray: isSelected ? undefined : "5, 5",
              }}
              eventHandlers={{
                click: () => onSelectZone(zone.id),
              }}
            />

            {/* Class Pin */}
            {icon && (
              <Marker
                position={[zone.lat, zone.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectZone(zone.id),
                }}
              >
                <Popup className="font-sans">
                  <div className="text-sm font-bold">{zone.name}</div>
                  <div className="text-xs text-gray-500">{zone.room}</div>
                </Popup>
              </Marker>
            )}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
