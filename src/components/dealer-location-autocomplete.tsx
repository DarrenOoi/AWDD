"use client";

import { useEffect, useRef, useState } from "react";

import { useGoogleMapsLoader } from "@/lib/google-maps-loader";

export type SelectedPlace = {
  label: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
};

type DealerLocationAutocompleteProps = {
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: SelectedPlace | null) => void;
  placeholder?: string;
  id?: string;
};

function parsePlace(place: google.maps.places.PlaceResult): SelectedPlace | null {
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();
  if (lat == null || lng == null) return null;

  let city: string | undefined;
  let state: string | undefined;

  for (const component of place.address_components ?? []) {
    if (component.types.includes("locality")) {
      city = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1")) {
      state = component.short_name;
    }
  }

  return {
    label: place.formatted_address ?? place.name ?? "",
    lat,
    lng,
    city,
    state,
  };
}

type PlacesAutocompleteBinderProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: SelectedPlace | null) => void;
};

function PlacesAutocompleteBinder({
  inputRef,
  onValueChange,
  onPlaceSelect,
}: PlacesAutocompleteBinderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded } = useGoogleMapsLoader();

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !apiKey) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "au" },
      fields: ["address_components", "geometry", "formatted_address", "name"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const parsed = parsePlace(place);
      if (parsed) {
        onValueChange(parsed.city ?? parsed.label);
        onPlaceSelect(parsed);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [apiKey, inputRef, isLoaded, onPlaceSelect, onValueChange]);

  return null;
}

export function DealerLocationAutocomplete({
  value,
  onValueChange,
  onPlaceSelect,
  placeholder = "City, suburb, or address in Australia",
  id = "dealer-location-search",
}: DealerLocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapsEnabled, setMapsEnabled] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onFocus={() => setMapsEnabled(true)}
        onChange={(event) => {
          onValueChange(event.target.value);
          onPlaceSelect(null);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
      />
      {mapsEnabled ? (
        <PlacesAutocompleteBinder
          inputRef={inputRef}
          onValueChange={onValueChange}
          onPlaceSelect={onPlaceSelect}
        />
      ) : null}
    </>
  );
}
