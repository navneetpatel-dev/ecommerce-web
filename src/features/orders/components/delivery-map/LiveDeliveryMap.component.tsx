"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { ordersComponentsStyles } from "../actions/ordersComponents.styles";

interface LiveDeliveryMapProps {
  lat: number;
  lng: number;
  label?: string;
}

/**
 * Client-only Leaflet map with a live-updating marker. Uses an inline SVG
 * divIcon instead of Leaflet's default marker images — those resolve via
 * webpack `require()` paths that Next/Turbopack doesn't rewrite the same way,
 * so the stock marker silently 404s unless worked around.
 */
export function LiveDeliveryMap({ lat, lng, label }: LiveDeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const icon = L.divIcon({
        className: "",
        html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="white" stroke-width="2"/>
          <path d="M12 6a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4Z" fill="white"/>
        </svg>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      if (label) markerRef.current.bindPopup(label);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className={ordersComponentsStyles.mapContainer}
      role="img"
      aria-label={label ?? "Delivery agent live location"}
    />
  );
}
