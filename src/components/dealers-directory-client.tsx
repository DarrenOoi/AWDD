"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DeferredDealerMap } from "@/components/deferred-dealer-map";
import { DealerSearchInput } from "@/components/dealer-search-input";
import type { SelectedPlace } from "@/components/dealer-search-input";
import { DealerResultRow } from "@/components/dealer-result-row";
import { describeDealerFilters, filterDealers, getDealerCities } from "@/lib/dealer-search";
import type { Dealer } from "@/types/dealer";

type DealersDirectoryClientProps = {
  dealers: Dealer[];
};

type MobilePanel = "list" | "map";

const MAP_HEIGHT = "h-[min(420px,55vh)] lg:h-[calc(100vh-8.5rem)] lg:min-h-[420px]";

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

function useDesktopMapEnabled() {
  const [desktopMapEnabled, setDesktopMapEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopMapEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return desktopMapEnabled;
}

export function DealersDirectoryClient({ dealers }: DealersDirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const desktopMapEnabled = useDesktopMapEnabled();

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("list");

  const queryFilter = searchParams.get("q") ?? searchParams.get("city") ?? "";
  const near = parseNear(searchParams.get("lat"), searchParams.get("lng"));
  const hasActiveFilter = Boolean(queryFilter.trim() || near);

  const cityOptions = useMemo(() => getDealerCities(dealers), [dealers]);

  const syncUrl = useCallback(
    (next: { q: string; near: { lat: number; lng: number } | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.q.trim()) params.set("q", next.q.trim());
      else {
        params.delete("q");
        params.delete("city");
      }
      if (next.near) {
        params.set("lat", String(next.near.lat));
        params.set("lng", String(next.near.lng));
      } else {
        params.delete("lat");
        params.delete("lng");
      }
      params.delete("brand");
      params.delete("type");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filteredDealers = useMemo(() => {
    return filterDealers(dealers, {
      query: near ? undefined : queryFilter,
      near: near ? { ...near, radiusKm: 80 } : null,
    });
  }, [dealers, near, queryFilter]);

  const resultSummary = useMemo(
    () =>
      describeDealerFilters(dealers.length, filteredDealers.length, {
        query: queryFilter,
        near,
      }),
    [dealers.length, filteredDealers.length, near, queryFilter],
  );

  const handlePlaceSelect = (place: SelectedPlace | null) => {
    if (place) {
      syncUrl({
        q: place.city ?? place.label,
        near: { lat: place.lat, lng: place.lng },
      });
      return;
    }
    syncUrl({ q: queryFilter, near: null });
  };

  const clearFilters = () => syncUrl({ q: "", near: null });

  const selectCity = (city: string) => syncUrl({ q: city, near: null });

  const mapEnabled = desktopMapEnabled || mobilePanel === "map";

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <label className="min-w-0 flex-1 space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Search
              </span>
              <DealerSearchInput
                dealers={dealers}
                value={queryFilter}
                onValueChange={(value) => {
                  syncUrl({ q: value, near: null });
                }}
                onPlaceSelect={handlePlaceSelect}
                placeholder="Dealer name, city, or suburb"
              />
            </label>
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 self-end rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 sm:mt-6 sm:self-auto"
              >
                Clear
              </button>
            ) : null}
          </div>

          <p className="text-xs text-stone-500">
            Pick a dealer or city from suggestions, use Google for suburbs, or tap a city chip below.
          </p>

          <div className="flex flex-wrap gap-2">
            {cityOptions.map((city) => {
              const active = !near && queryFilter.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectCity(city)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80 hover:bg-stone-200/80"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-stone-600">{resultSummary}</p>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="flex rounded-xl border border-stone-200 bg-stone-100/80 p-1">
          {(["list", "map"] as const).map((panel) => (
            <button
              key={panel}
              type="button"
              onClick={() => setMobilePanel(panel)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
                mobilePanel === panel
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-800"
              }`}
            >
              {panel}
            </button>
          ))}
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
              No dealers found. Pick a city below, choose a location from the suggestions, or try a dealer
              name.
            </p>
          )}
        </div>

        <div
          className={`min-w-0 flex-1 lg:sticky lg:top-24 lg:max-w-[min(48%,720px)] ${
            mobilePanel === "list" ? "hidden lg:block" : ""
          }`}
        >
          <div className={MAP_HEIGHT}>
            <DeferredDealerMap
              dealers={filteredDealers}
              heightClassName={MAP_HEIGHT}
              enabled={mapEnabled}
            />
          </div>
          <p className="mt-2 text-center text-xs text-stone-500 lg:text-left">
            {near
              ? "Showing dealers within ~80 km of your search. Zoom in to see individual pins."
              : "Tap a pin for a quick preview. Clustered pins split when you zoom in."}
          </p>
        </div>
      </div>
    </section>
  );
}
