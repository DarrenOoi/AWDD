"use client";

import { useJsApiLoader } from "@react-google-maps/api";

/** Shared loader config — all useJsApiLoader calls must use the same id and libraries. */
export const GOOGLE_MAPS_SCRIPT_ID = "awg-google-maps-script";
export const GOOGLE_MAPS_LIBRARIES = ["places", "marker"] as const;
/** Stable array reference — do not spread into useJsApiLoader or LoadScript reloads. */
export const GOOGLE_MAPS_LOADER_LIBRARIES: ("marker" | "places")[] = [
  "places",
  "marker",
];
export const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

export function useGoogleMapsLoader() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return useJsApiLoader({
    id: GOOGLE_MAPS_SCRIPT_ID,
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LOADER_LIBRARIES,
  });
}
