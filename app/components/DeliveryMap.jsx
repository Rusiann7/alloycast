"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default icon path issue in Next.js bundlers
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to catch click events on the Leaflet map
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      if (onLocationSelect) onLocationSelect(newPos);
    },
  });

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          const newPos = { lat: pos.lat, lng: pos.lng };
          setPosition(newPos);
          if (onLocationSelect) onLocationSelect(newPos);
        },
      }}
    />
  ) : null;
}

export default function DeliveryMap({ initialLat = 14.8386, initialLng = 120.2842, onLocationSelect }) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    setPosition({ lat: initialLat, lng: initialLng });
  }, [initialLat, initialLng]);

  return (
    <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-white/10 relative z-0 shadow-inner">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
}
