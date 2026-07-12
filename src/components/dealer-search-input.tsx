"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { useGoogleMapsLoader } from "@/lib/google-maps-loader";
import { getDealerSearchSuggestions } from "@/lib/dealer-search";
import type { Dealer } from "@/types/dealer";

export type SelectedPlace = {
  label: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
};

type DealerSearchInputProps = {
  dealers: Dealer[];
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: SelectedPlace | null) => void;
  placeholder?: string;
  id?: string;
};

type DirectorySuggestion = ReturnType<typeof getDealerSearchSuggestions>[number];

type PlaceSuggestion = {
  source: "place";
  key: string;
  label: string;
  placePrediction: google.maps.places.PlacePrediction;
};

type SearchRow = DirectorySuggestion | PlaceSuggestion;

function isPlaceSuggestion(row: SearchRow): row is PlaceSuggestion {
  return "source" in row && row.source === "place";
}

async function placePredictionToSelected(
  prediction: google.maps.places.PlacePrediction,
): Promise<SelectedPlace | null> {
  const place = prediction.toPlace();
  await place.fetchFields({
    fields: ["location", "addressComponents", "formattedAddress", "displayName"],
  });

  const lat = place.location?.lat();
  const lng = place.location?.lng();
  if (lat == null || lng == null) return null;

  let city: string | undefined;
  let state: string | undefined;

  for (const component of place.addressComponents ?? []) {
    if (component.types.includes("locality")) {
      city = component.longText ?? undefined;
    }
    if (component.types.includes("administrative_area_level_1")) {
      state = component.shortText ?? undefined;
    }
  }

  return {
    label: place.formattedAddress ?? place.displayName ?? prediction.text.toString(),
    lat,
    lng,
    city,
    state,
  };
}

export function DealerSearchInput({
  dealers,
  value,
  onValueChange,
  onPlaceSelect,
  placeholder = "Dealer name, city, or suburb",
  id: idProp,
}: DealerSearchInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const listboxId = `${inputId}-suggestions`;

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const requestIdRef = useRef(0);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded } = useGoogleMapsLoader();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  const directorySuggestions = useMemo(
    () => getDealerSearchSuggestions(dealers, value),
    [dealers, value],
  );

  const rows: SearchRow[] = useMemo(
    () => [...directorySuggestions, ...placeSuggestions],
    [directorySuggestions, placeSuggestions],
  );

  const showSuggestions = open && value.trim().length > 0 && (rows.length > 0 || placesLoading);

  useEffect(() => {
    if (!isLoaded || !apiKey || value.trim().length < 2) {
      setPlaceSuggestions([]);
      setPlacesLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      setPlacesLoading(true);
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value.trim(),
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ["au"],
          language: "en-AU",
          region: "au",
        });

        if (requestId !== requestIdRef.current) return;

        const next: PlaceSuggestion[] = [];
        for (const suggestion of suggestions) {
          const prediction = suggestion.placePrediction;
          if (!prediction) continue;
          next.push({
            source: "place",
            key: prediction.placeId,
            label: prediction.text.toString(),
            placePrediction: prediction,
          });
          if (next.length >= 5) break;
        }
        setPlaceSuggestions(next);
      } catch {
        if (requestId === requestIdRef.current) {
          setPlaceSuggestions([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setPlacesLoading(false);
        }
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [apiKey, isLoaded, value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectDirectorySuggestion = (suggestion: DirectorySuggestion) => {
    setOpen(false);
    setActiveIndex(-1);
    onPlaceSelect(null);
    onValueChange(suggestion.label);
    inputRef.current?.blur();
  };

  const selectPlaceSuggestion = async (suggestion: PlaceSuggestion) => {
    setOpen(false);
    setActiveIndex(-1);
    try {
      const selected = await placePredictionToSelected(suggestion.placePrediction);
      if (selected) {
        onValueChange(selected.city ?? selected.label);
        onPlaceSelect(selected);
      }
    } finally {
      sessionTokenRef.current = null;
    }
    inputRef.current?.blur();
  };

  const selectRow = (row: SearchRow) => {
    if (isPlaceSuggestion(row)) {
      void selectPlaceSuggestion(row);
    } else {
      selectDirectorySuggestion(row);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || rows.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectRow(rows[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const directoryCount = directorySuggestions.length;

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          sessionTokenRef.current = null;
          onValueChange(event.target.value);
          onPlaceSelect(null);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
      />

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-72 w-full overflow-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg ring-1 ring-stone-200/80"
        >
          {directoryCount > 0 ? (
            <>
              <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                Dealers
              </li>
              {directorySuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.kind === "dealer" ? suggestion.id : suggestion.label}
                  role="option"
                >
                  <button
                    type="button"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectDirectorySuggestion(suggestion)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition ${
                      index === activeIndex ? "bg-stone-100" : "hover:bg-stone-50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                        suggestion.kind === "dealer"
                          ? "bg-accent/10 text-accent"
                          : "bg-stone-100 text-stone-600"
                      }`}
                      aria-hidden
                    >
                      {suggestion.kind === "dealer" ? "D" : "C"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-stone-900">
                        {suggestion.label}
                      </span>
                      {suggestion.kind === "dealer" ? (
                        <span className="block truncate text-xs text-stone-500">
                          {suggestion.sublabel}
                        </span>
                      ) : (
                        <span className="block text-xs text-stone-500">City</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </>
          ) : null}

          {placesLoading ? (
            <li className="px-3 py-2.5 text-xs text-stone-500">Loading locations…</li>
          ) : null}

          {placeSuggestions.length > 0 ? (
            <>
              <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                Locations
              </li>
              {placeSuggestions.map((suggestion, placeIndex) => {
                const index = directoryCount + placeIndex;
                return (
                  <li key={suggestion.key} role="option">
                    <button
                      type="button"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => void selectPlaceSuggestion(suggestion)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition ${
                        index === activeIndex ? "bg-stone-100" : "hover:bg-stone-50"
                      }`}
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-semibold text-sky-700"
                        aria-hidden
                      >
                        ↗
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-stone-900">
                          {suggestion.label}
                        </span>
                        <span className="block text-xs text-stone-500">Search nearby</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
