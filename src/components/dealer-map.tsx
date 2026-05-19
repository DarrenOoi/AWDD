"use client";

import { MarkerClusterer, type Cluster } from "@googlemaps/markerclusterer";
import { GoogleMap, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DealerMapExternalPopup } from "@/components/dealer-map-external-popup";
import { DealerMapPopup } from "@/components/dealer-map-popup";
import type { Dealer } from "@/types/dealer";

const libraries: ("places")[] = ["places"];

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

const defaultCenter = { lat: -27, lng: 133.5 };

const australiaViewBounds = {
  north: -9,
  south: -44,
  west: 111,
  east: 153,
};

const mapPanBounds = {
  north: 8,
  south: -58,
  west: 88,
  east: 185,
};

const PIN_PATH =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";

const mapOptions: google.maps.MapOptions = {
  center: defaultCenter,
  zoom: DEFAULT_INITIAL_ZOOM,
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

function createPinIcon(fillColor: string): google.maps.Symbol {
  return {
    path: PIN_PATH,
    fillColor,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: 1.65,
    anchor: new google.maps.Point(12, 22),
  };
}

function createClusterMarker(cluster: Cluster): google.maps.Marker {
  const count = cluster.count;
  const scale = count < 10 ? 18 : 22;

  return new google.maps.Marker({
    position: cluster.position,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale,
      fillColor: "#006039",
      fillOpacity: 0.95,
      strokeColor: "#ffffff",
      strokeWeight: 2.5,
    },
    label: {
      text: String(count),
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "700",
    },
    zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
  });
}

function focusMapOnAustralia(map: google.maps.Map) {
  const bounds = new google.maps.LatLngBounds(
    { lat: australiaViewBounds.south, lng: australiaViewBounds.west },
    { lat: australiaViewBounds.north, lng: australiaViewBounds.east },
  );
  map.fitBounds(bounds, { top: 44, bottom: 44, left: 56, right: 56 });

  google.maps.event.addListenerOnce(map, "idle", () => {
    const z = map.getZoom();
    if (z != null) {
      map.setZoom(
        Math.min(AUSTRALIA_OVERVIEW_MAX_ZOOM, Math.max(AUSTRALIA_OVERVIEW_MIN_ZOOM, z)),
      );
    }
  });
}

function fitMapToDealers(map: google.maps.Map, dealerList: Dealer[]) {
  if (dealerList.length === 0) {
    focusMapOnAustralia(map);
    return;
  }
  if (dealerList.length === 1) {
    map.setCenter({ lat: dealerList[0].lat, lng: dealerList[0].lng });
    map.setZoom(11);
    return;
  }
  const bounds = new google.maps.LatLngBounds();
  dealerList.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
  map.fitBounds(bounds, 56);
  google.maps.event.addListenerOnce(map, "idle", () => {
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
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  const { isLoaded, loadError } = useJsApiLoader({
    id: "awdd-google-maps-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  const pinIcon = useMemo(
    () => (typeof google !== "undefined" ? createPinIcon("#006039") : undefined),
    [isLoaded],
  );

  const activePinIcon = useMemo(
    () => (typeof google !== "undefined" ? createPinIcon("#004d2d") : undefined),
    [isLoaded],
  );

  const infoWindowOptions = useMemo(
    () =>
      typeof google !== "undefined"
        ? { pixelOffset: new google.maps.Size(0, -42), maxWidth: 280 }
        : undefined,
    [isLoaded],
  );

  const onMapLoad = useCallback(
    (instance: google.maps.Map) => {
      setMap(instance);
      if (defaultAustraliaView) {
        focusMapOnAustralia(instance);
      }
    },
    [defaultAustraliaView],
  );

  useEffect(() => {
    if (!map) return;
    if (defaultAustraliaView) {
      focusMapOnAustralia(map);
      return;
    }
    fitMapToDealers(map, dealers);
  }, [dealers, defaultAustraliaView, map]);

  useEffect(() => {
    if (!map || !isLoaded || !pinIcon) return;

    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();

    const markers = dealers.map((dealer) => {
      const marker = new google.maps.Marker({
        position: { lat: dealer.lat, lng: dealer.lng },
        icon: pinIcon,
      });
      marker.addListener("click", () => setActiveId(dealer.id));
      markersRef.current.set(dealer.id, marker);
      return marker;
    });

    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      renderer: { render: createClusterMarker },
      onClusterClick: () => {},
    });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
    };
  }, [dealers, isLoaded, map, pinIcon]);

  useEffect(() => {
    if (!pinIcon || !activePinIcon) return;
    markersRef.current.forEach((marker, id) => {
      marker.setIcon(id === activeId ? activePinIcon : pinIcon);
      marker.setZIndex(id === activeId ? 2 : 1);
    });
  }, [activeId, activePinIcon, pinIcon]);

  const activeDealer = dealers.find((dealer) => dealer.id === activeId) ?? null;

  if (!apiKey) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 text-center text-sm text-stone-600 ${heightClassName} ${wrapperClassName}`}
      >
        <p className="font-medium text-stone-800">Google Maps API key missing</p>
        <p>
          Add{" "}
          <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-xs text-stone-800">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to <code className="font-mono text-xs">.env.local</code> and restart the dev server.
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
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={defaultCenter}
        zoom={defaultAustraliaView ? DEFAULT_INITIAL_ZOOM : DEFAULT_INITIAL_ZOOM + 0.25}
        onLoad={onMapLoad}
        options={mapOptions}
        onClick={() => setActiveId(null)}
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
