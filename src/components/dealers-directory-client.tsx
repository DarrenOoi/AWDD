"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import {
  DealerLocationAutocomplete,
  type SelectedPlace,
} from "@/components/dealer-location-autocomplete";
import { DealerResultRow } from "@/components/dealer-result-row";
import { filterDealers } from "@/lib/dealer-search";
import type { Dealer } from "@/types/dealer";

const DealerMap = dynamic(
  () => import("@/components/dealer-map").then((mod) => mod.DealerMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,55vh)] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 lg:h-[calc(100vh-8.5rem)] lg:min-h-[420px]">
        Loading map…
      </div>
    ),
  },
);

type DealersDirectoryClientProps = {
  dealers: Dealer[];
};

type MobilePanel = "list" | "map";

function parseNear(
  lat: string | null,
  lng: string | null,
): { lat: number; lng: number } | null {
  if (!lat || !lng) return null;
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return null;
  return { lat: latNum, lng: lngNum };
}

export function DealersDirectoryClient({ dealers }: DealersDirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("list");

  const queryFilter = searchParams.get("q") ?? searchParams.get("city") ?? "";
  const brandFilter = searchParams.get("brand") ?? "";
  const near = parseNear(searchParams.get("lat"), searchParams.get("lng"));

  const syncUrl = useCallback(
    (next: {
      q: string;
      brand: string;
      near: { lat: number; lng: number } | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.q.trim()) params.set("q", next.q.trim());
      else {
        params.delete("q");
        params.delete("city");
      }
      if (next.brand.trim()) params.set("brand", next.brand.trim());
      else params.delete("brand");
      if (next.near) {
        params.set("lat", String(next.near.lat));
        params.set("lng", String(next.near.lng));
      } else {
        params.delete("lat");
        params.delete("lng");
      }
      params.delete("type");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filteredDealers = useMemo(() => {
    return filterDealers(dealers, {
      query: queryFilter,
      brand: brandFilter,
      near: near ? { ...near, radiusKm: 80 } : null,
    });
  }, [brandFilter, dealers, near, queryFilter]);

  const resultSummary = useMemo(() => {
    const q = queryFilter.trim();
    const brand = brandFilter.trim();
    if (!q && !brand && !near) return `${filteredDealers.length} dealers across Australia`;
    const parts: string[] = [];
    if (brand) parts.push(brand);
    if (q) parts.push(near ? `near ${q}` : `matching “${q}”`);
    return `${filteredDealers.length} results ${parts.join(" · ")}`.trim();
  }, [brandFilter, filteredDealers.length, near, queryFilter]);

  const handlePlaceSelect = (place: SelectedPlace | null) => {
    syncUrl({
      q: place?.city ?? queryFilter,
      brand: brandFilter,
      near: place ? { lat: place.lat, lng: place.lng } : null,
    });
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Location
              </span>
              <DealerLocationAutocomplete
                value={queryFilter}
                onValueChange={(value) => {
                  syncUrl({ q: value, brand: brandFilter, near });
                }}
                onPlaceSelect={handlePlaceSelect}
                placeholder="City, suburb, or address"
              />
              <p className="text-xs text-stone-500">
                Pick a suggestion for nearby results, or type to match name, city, or address.
              </p>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Brand
              </span>
              <input
                value={brandFilter}
                onChange={(event) => {
                  syncUrl({ q: queryFilter, brand: event.target.value, near });
                }}
                placeholder="Rolex, Omega…"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
              />
            </label>
          </div>
          <p className="text-sm text-stone-600 lg:max-w-xs lg:text-right">{resultSummary}</p>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="flex rounded-xl border border-stone-200 bg-stone-100/80 p-1">
          <button
            type="button"
            onClick={() => setMobilePanel("list")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              mobilePanel === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel("map")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              mobilePanel === "map" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div
          className={`min-h-0 min-w-0 flex-1 space-y-3 lg:max-w-[min(52%,640px)] ${
            mobilePanel === "map" ? "hidden lg:block" : ""
          }`}
        >
          {filteredDealers.length > 0 ? (
            filteredDealers.map((dealer) => <DealerResultRow key={dealer.id} dealer={dealer} />)
          ) : (
            <p className="rounded-xl border border-dashed border-stone-300 bg-white/70 p-10 text-center text-stone-500">
              No dealers match. Try a suburb from the suggestions, or a shorter search term.
            </p>
          )}
        </div>

        <div
          className={`min-w-0 flex-1 lg:sticky lg:top-24 lg:max-w-[min(48%,720px)] ${
            mobilePanel === "list" ? "hidden lg:block" : ""
          }`}
        >
          <DealerMap
            dealers={filteredDealers}
            heightClassName="h-[min(420px,55vh)] lg:h-[calc(100vh-8.5rem)] lg:min-h-[420px]"
          />
          <p className="mt-2 text-center text-xs text-stone-500 lg:text-left">
            Map updates as you filter. Tap a pin for a quick preview.
          </p>
        </div>
      </div>
    </section>
  );
}
