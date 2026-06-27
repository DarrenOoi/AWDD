export const siteConfig = {
  name: "Australian Watch Dealer Directory",
  shortName: "AWDD",
  description:
    "Discover trusted watch dealers across Australia. Browse curated listings by city and brand, compare ratings, and find specialist storefronts.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: "/images/heroes/bezel.webp",
  locale: "en_AU",
} as const;

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
