import type { Dealer } from "@/types/dealer";

export type DealerSearchNear = {
  lat: number;
  lng: number;
  radiusKm?: number;
};

const STATE_ALIASES: Record<string, string[]> = {
  NSW: ["new south wales", "nsw"],
  VIC: ["victoria", "vic"],
  QLD: ["queensland", "qld"],
  WA: ["western australia", "wa"],
  SA: ["south australia", "sa"],
  TAS: ["tasmania", "tas"],
  ACT: ["australian capital territory", "act", "canberra"],
  NT: ["northern territory", "nt"],
};

const DEFAULT_NEAR_RADIUS_KM = 80;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function dealerSearchText(dealer: Dealer): string {
  const stateAliases = STATE_ALIASES[dealer.state] ?? [];
  return [dealer.name, dealer.city, dealer.state, ...stateAliases, dealer.address]
    .join(" ")
    .toLowerCase();
}

export function dealerMatchesQuery(dealer: Dealer, query: string): boolean {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const haystack = dealerSearchText(dealer);
  return tokens.every((token) => haystack.includes(token));
}

export function getDealerCities(dealers: Dealer[]): string[] {
  const cities = new Set<string>();
  for (const dealer of dealers) {
    cities.add(dealer.city);
  }
  return [...cities].sort((a, b) => a.localeCompare(b));
}

export type DealerSearchSuggestion =
  | { kind: "dealer"; id: string; label: string; sublabel: string }
  | { kind: "city"; label: string };

/** Suggestions from our dealer list — shown while typing. */
export function getDealerSearchSuggestions(
  dealers: Dealer[],
  query: string,
  limit = 8,
): DealerSearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const suggestions: DealerSearchSuggestion[] = [];
  const seenCities = new Set<string>();

  for (const dealer of dealers) {
    if (dealerMatchesQuery(dealer, q)) {
      suggestions.push({
        kind: "dealer",
        id: dealer.id,
        label: dealer.name,
        sublabel: `${dealer.city}, ${dealer.state}`,
      });
    }
  }

  for (const city of getDealerCities(dealers)) {
    if (city.toLowerCase().includes(q) && !seenCities.has(city)) {
      seenCities.add(city);
      suggestions.push({ kind: "city", label: city });
    }
  }

  return suggestions.slice(0, limit);
}

export function filterDealers(
  dealers: Dealer[],
  options: {
    query?: string;
    near?: DealerSearchNear | null;
  },
): Dealer[] {
  if (options.near) {
    const radiusKm = options.near.radiusKm ?? DEFAULT_NEAR_RADIUS_KM;
    return dealers.filter(
      (dealer) =>
        haversineKm(options.near!, { lat: dealer.lat, lng: dealer.lng }) <= radiusKm,
    );
  }

  const query = options.query?.trim();
  if (!query) return dealers;

  return dealers.filter((dealer) => dealerMatchesQuery(dealer, query));
}

export function describeDealerFilters(
  total: number,
  filteredCount: number,
  options: {
    query?: string;
    near?: DealerSearchNear | null;
  },
): string {
  if (filteredCount === total && !options.query?.trim() && !options.near) {
    return `${filteredCount} dealers across Australia`;
  }

  const label = options.query?.trim();
  if (options.near && label) {
    return `${filteredCount} dealer${filteredCount === 1 ? "" : "s"} near ${label}`;
  }
  if (label) {
    return `${filteredCount} dealer${filteredCount === 1 ? "" : "s"} matching “${label}”`;
  }
  return `${filteredCount} dealer${filteredCount === 1 ? "" : "s"}`;
}

export function googleMapsPlaceUrl(dealer: Dealer): string {
  const query = encodeURIComponent(`${dealer.name}, ${dealer.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function googleMapsDirectionsUrl(dealer: Dealer): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lng}`;
}
