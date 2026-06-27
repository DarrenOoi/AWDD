"use client";

import { MarkerClusterer, type Cluster } from "@googlemaps/markerclusterer";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DealerMapExternalPopup } from "@/components/dealer-map-external-popup";
import { DealerMapPopup } from "@/components/dealer-map-popup";
import { GOOGLE_MAPS_MAP_ID, useGoogleMapsLoader } from "@/lib/google-maps-loader";
import type { Dealer } from "@/types/dealer";

const mapId = GOOGLE_MAPS_MAP_ID;

const CLUSTER_TIGHT_SPAN_DEGREES = 2;

type AdvancedMarker = google.maps.marker.AdvancedMarkerElement & { dealerId?: string };

type DealerMapProps = {
  dealers: Dealer[];
  heightClassName?: string;
  wrapperClassName?: string;
  defaultAustraliaView?: boolean;
  /** On profile maps, show Google Maps links instead of an in-app profile popup. */
  markerPopup?: "dealer" | "google-maps";
};

const AUSTRALIA_OVERVIEW_MIN_ZOOM = 4.15;
const AUSTRALIA_OVERVIEW_MAX_ZOOM = 4.65;
const DEFAULT_INITIAL_ZOOM = 4.4;
const NATIONAL_DEALER_MAX_ZOOM = 5.25;

const mapPanBounds = {
  north: 8,
  south: -58,
  west: 88,
  east: 185,
};

const mapContainerStyle = { width: "100%", height: "100%" } as const;

const mapOptions: google.maps.MapOptions = {
  mapId,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
  gestureHandling: "greedy",
  minZoom: 2,
  restriction: {
    latLngBounds: mapPanBounds,
    strictBounds: false,
  },
};

function createDealerPin(active: boolean) {
  return new google.maps.marker.PinElement({
    background: active ? "#004d2d" : "#006039",
    borderColor: "#ffffff",
    glyph: "",
    scale: 1.15,
  });
}

function createClusterContent(count: number): HTMLElement {
  const size = count < 10 ? 36 : 44;
  const element = document.createElement("div");
  element.textContent = String(count);
  Object.assign(element.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    background: "rgba(0, 96, 57, 0.95)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    border: "2.5px solid #ffffff",
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
    cursor: "pointer",
    pointerEvents: "auto",
  });
  return element;
}

function createClusterMarker(
  cluster: Cluster,
  _stats: unknown,
  map: google.maps.Map,
): AdvancedMarker {
  return new google.maps.marker.AdvancedMarkerElement({
    map,
    position: cluster.position,
    content: createClusterContent(cluster.count),
    zIndex: cluster.count,
    gmpClickable: true,
  });
}

function clusterBoundsSpan(bounds: google.maps.LatLngBounds) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return { latSpan: ne.lat() - sw.lat(), lngSpan: ne.lng() - sw.lng() };
}

function clusterPositionLiteral(cluster: Cluster): google.maps.LatLngLiteral {
  const position = cluster.position;
  if (position instanceof google.maps.LatLng) {
    return { lat: position.lat(), lng: position.lng() };
  }
  return position;
}

function latLngLiteralFromLatLng(
  latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined,
): google.maps.LatLngLiteral | null {
  if (!latLng) return null;
  if (latLng instanceof google.maps.LatLng) {
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }
  if (Number.isFinite(latLng.lat) && Number.isFinite(latLng.lng)) {
    return { lat: latLng.lat, lng: latLng.lng };
  }
  return null;
}

function resolveClusterClickTarget(
  event: google.maps.MapMouseEvent,
  cluster: Cluster,
): google.maps.LatLngLiteral {
  // Prefer the actual click point on the cluster icon the user tapped.
  const fromEvent = latLngLiteralFromLatLng(event.latLng);
  if (fromEvent) return fromEvent;

  // Fallback: rendered cluster marker position (where the circle is drawn).
  const clusterMarker = cluster.marker as AdvancedMarker | undefined;
  if (clusterMarker?.position) {
    const fromMarker = latLngLiteralFromLatLng(clusterMarker.position);
    if (fromMarker) return fromMarker;
  }

  return clusterPositionLiteral(cluster);
}

/** Cluster click — tight clusters use fitBounds; everything else steps in at the click point. */
function focusClusterOnMap(
  map: google.maps.Map,
  cluster: Cluster,
  clickTarget: google.maps.LatLngLiteral,
  isViewCurrent: (generation: number) => boolean,
  viewGeneration: number,
) {
  const bounds = cluster.bounds;
  const currentZoom = map.getZoom() ?? DEFAULT_INITIAL_ZOOM;
  const nextZoom = Math.min(currentZoom + 2, 16);

  if (!bounds) {
    map.panTo(clickTarget);
    map.setZoom(nextZoom);
    return;
  }

  const { latSpan, lngSpan } = clusterBoundsSpan(bounds);
  const isTight =
    latSpan < CLUSTER_TIGHT_SPAN_DEGREES && lngSpan < CLUSTER_TIGHT_SPAN_DEGREES;

  // Only city-scale clusters get fitBounds. Regional/national clusters step in
  // at the icon the user clicked — fitBounds bbox centre lands in the outback.
  if (!isTight) {
    map.panTo(clickTarget);
    map.setZoom(nextZoom);
    return;
  }

  map.fitBounds(bounds, 80);

  google.maps.event.addListenerOnce(map, "idle", () => {
    if (!isViewCurrent(viewGeneration)) return;

    const zoom = map.getZoom();
    if (zoom == null) return;

    if (zoom < 12) {
      map.setZoom(12);
    } else if (zoom > 14) {
      map.setZoom(14);
    }
  });
}

function focusMapOnAustralia(
  map: google.maps.Map,
  dealerList: Dealer[],
  viewGeneration: number,
  isViewCurrent: (generation: number) => boolean,
) {
  if (dealerList.length === 0) return;

  if (dealerList.length === 1) {
    map.setCenter({ lat: dealerList[0].lat, lng: dealerList[0].lng });
    map.setZoom(6);
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  dealerList.forEach((dealer) => bounds.extend({ lat: dealer.lat, lng: dealer.lng }));
  map.fitBounds(bounds, { top: 44, bottom: 44, left: 56, right: 56 });

  google.maps.event.addListenerOnce(map, "idle", () => {
    if (!isViewCurrent(viewGeneration)) return;

    const z = map.getZoom();
    if (z == null) return;

    map.setZoom(
      Math.min(
        AUSTRALIA_OVERVIEW_MAX_ZOOM,
        Math.max(AUSTRALIA_OVERVIEW_MIN_ZOOM, Math.min(z, NATIONAL_DEALER_MAX_ZOOM)),
      ),
    );
  });
}

function fitMapToDealers(
  map: google.maps.Map,
  dealerList: Dealer[],
  viewGeneration: number,
  isViewCurrent: (generation: number) => boolean,
) {
  if (dealerList.length === 0) {
    focusMapOnAustralia(map, [], viewGeneration, isViewCurrent);
    return;
  }
  if (dealerList.length === 1) {
    map.panTo({ lat: dealerList[0].lat, lng: dealerList[0].lng });
    map.setZoom(11);
    return;
  }
  const bounds = new google.maps.LatLngBounds();
  dealerList.forEach((dealer) => bounds.extend({ lat: dealer.lat, lng: dealer.lng }));
  map.fitBounds(bounds, 56);
  google.maps.event.addListenerOnce(map, "idle", () => {
    if (!isViewCurrent(viewGeneration)) return;

    const z = map.getZoom();
    if (z == null) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latSpan = ne.lat() - sw.lat();
    const lngSpan = ne.lng() - sw.lng();
    const isWideSpread = latSpan > 12 || lngSpan > 18;

    if (isWideSpread && z > NATIONAL_DEALER_MAX_ZOOM) {
      map.setZoom(NATIONAL_DEALER_MAX_ZOOM);
    } else if (z > 12) {
      map.setZoom(12);
    }
  });
}

export function DealerMap({
  dealers,
  heightClassName = "h-[420px]",
  wrapperClassName = "",
  defaultAustraliaView = false,
  markerPopup = "dealer",
}: DealerMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<Map<string, AdvancedMarker>>(new Map());
  const userAdjustedViewRef = useRef(false);
  const initialAustraliaViewAppliedRef = useRef(false);
  const viewGenerationRef = useRef(0);

  const isViewCurrent = useCallback(
    (generation: number) => generation === viewGenerationRef.current,
    [],
  );

  const bumpViewGeneration = useCallback(() => {
    viewGenerationRef.current += 1;
    return viewGenerationRef.current;
  }, []);

  const { isLoaded, loadError } = useGoogleMapsLoader();

  const infoWindowOptions = useMemo(
    () =>
      typeof google !== "undefined"
        ? { pixelOffset: new google.maps.Size(0, -42), maxWidth: 280 }
        : undefined,
    [isLoaded],
  );

  const onMapLoad = useCallback((instance: google.maps.Map) => {
    setMap(instance);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!map) return;
    if (defaultAustraliaView) {
      if (userAdjustedViewRef.current || initialAustraliaViewAppliedRef.current) return;
      initialAustraliaViewAppliedRef.current = true;
      const generation = bumpViewGeneration();
      focusMapOnAustralia(map, dealers, generation, isViewCurrent);
      return;
    }
    userAdjustedViewRef.current = false;
    const generation = bumpViewGeneration();
    fitMapToDealers(map, dealers, generation, isViewCurrent);
  }, [bumpViewGeneration, dealers, defaultAustraliaView, isViewCurrent, map]);

  useEffect(() => {
    if (!map || !isLoaded || typeof google === "undefined" || !google.maps.marker) return;

    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current.clear();

    const markers = dealers.map((dealer) => {
      const pin = createDealerPin(false);
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: dealer.lat, lng: dealer.lng },
        content: pin,
        gmpClickable: true,
      }) as AdvancedMarker;
      marker.dealerId = dealer.id;
      marker.addListener("gmp-click", () => {
        userAdjustedViewRef.current = true;
        bumpViewGeneration();
        setActiveId(dealer.id);
      });
      markersRef.current.set(dealer.id, marker);
      return marker;
    });

    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      renderer: { render: createClusterMarker },
      onClusterClick: (event, cluster, mapInstance) => {
        userAdjustedViewRef.current = true;
        const generation = bumpViewGeneration();
        const clickTarget = resolveClusterClickTarget(event, cluster);
        focusClusterOnMap(mapInstance, cluster, clickTarget, isViewCurrent, generation);
      },
    });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current.clear();
    };
  }, [bumpViewGeneration, dealers, isLoaded, isViewCurrent, map]);

  useEffect(() => {
    if (!isLoaded || typeof google === "undefined" || !google.maps.marker) return;

    markersRef.current.forEach((marker, id) => {
      const pin = createDealerPin(id === activeId);
      marker.content = pin;
      marker.zIndex = id === activeId ? 2 : 1;
    });
  }, [activeId, isLoaded]);

  const activeDealer = dealers.find((dealer) => dealer.id === activeId) ?? null;

  if (!apiKey) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 text-center text-sm text-stone-600 ${heightClassName} ${wrapperClassName}`}
      >
        <p className="font-medium text-stone-800">Google Maps API key missing</p>
        <p>
          Add{" "}
          <code className="rounded bg-stone-200 px-1.5 py-0.5 font-[family-name:ui-monospace,monospace] text-xs text-stone-800">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to <code className="font-[family-name:ui-monospace,monospace] text-xs">.env.local</code> and restart
          the dev server.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-center text-sm text-red-800 ${heightClassName} ${wrapperClassName}`}
      >
        Could not load Google Maps. Check the API key and billing on Google Cloud.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 ${heightClassName} ${wrapperClassName}`}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-inner ring-1 ring-accent/15 ${heightClassName} ${wrapperClassName}`}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {activeDealer ? (
          <InfoWindow
            position={{ lat: activeDealer.lat, lng: activeDealer.lng }}
            options={infoWindowOptions}
            onCloseClick={() => setActiveId(null)}
          >
            {markerPopup === "google-maps" ? (
              <DealerMapExternalPopup dealer={activeDealer} />
            ) : (
              <DealerMapPopup dealer={activeDealer} />
            )}
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
