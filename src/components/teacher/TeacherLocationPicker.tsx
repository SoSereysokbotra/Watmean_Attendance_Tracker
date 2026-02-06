"use client";

import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map view updates when props change
const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const LocationMarker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function TeacherLocationPicker({
  lat,
  lng,
  onLocationSelect,
}: LocationPickerProps) {
  useEffect(() => {
    // Fix for default marker icons in Leaflet
    if (typeof window !== "undefined") {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    }
  }, []);

  const icon = useMemo(() => {
    if (typeof window === "undefined") return null;
    return L.divIcon({
      className: "custom-picker-icon",
      html: `<div class="relative flex h-6 w-6">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-6 w-6 bg-brand-primary border-2 border-white shadow-lg"></span>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      className="h-full w-full bg-muted"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater lat={lat} lng={lng} />
      {icon && <Marker position={[lat, lng]} icon={icon} />}
      <Circle
        center={[lat, lng]}
        pathOptions={{
          color: "hsl(var(--brand-primary))",
          fillColor: "hsl(var(--brand-primary))",
          fillOpacity: 0.1,
          weight: 1,
        }}
        radius={50}
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}
