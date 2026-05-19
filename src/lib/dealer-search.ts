import type { Dealer } from "@/types/dealer";

export type DealerSearchNear = {
  lat: number;
  lng: number;
  radiusKm?: number;
};

const STATE_ALIASES: Record<string, string[]> = {
  NSW: ["new south wales"],
  VIC: ["victoria"],
  QLD: ["queensland"],
  WA: ["western australia"],
  SA: ["south australia"],
  TAS: ["tasmania"],
  ACT: ["australian capital territory", "canberra"],
  NT: ["northern territory"],
};

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
  return [
    dealer.name,
    dealer.city,
    dealer.state,
    ...stateAliases,
    dealer.address,
    ...dealer.brands,
  ]
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

export function filterDealers(
  dealers: Dealer[],
  options: {
    query?: string;
    brand?: string;
    near?: DealerSearchNear | null;
  },
): Dealer[] {
  let result = dealers;

  if (options.near) {
    const radiusKm = options.near.radiusKm ?? 80;
    result = result.filter(
      (dealer) => haversineKm(options.near!, { lat: dealer.lat, lng: dealer.lng }) <= radiusKm,
    );
  }

  const query = options.query?.trim();
  if (query) {
    result = result.filter((dealer) => dealerMatchesQuery(dealer, query));
  }

  const brand = options.brand?.trim();
  if (brand) {
    result = result.filter((dealer) =>
      dealer.brands.some((entry) => entry.toLowerCase().includes(brand.toLowerCase())),
    );
  }

  return result;
}

export function googleMapsPlaceUrl(dealer: Dealer): string {
  const query = encodeURIComponent(`${dealer.name}, ${dealer.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function googleMapsDirectionsUrl(dealer: Dealer): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lng}`;
}
