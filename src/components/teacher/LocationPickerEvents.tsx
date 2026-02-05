"use client";

import { useMapEvents } from "react-leaflet";

interface LocationPickerEventsProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPickerEvents = ({
  onLocationSelect,
}: LocationPickerEventsProps) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default LocationPickerEvents;
