export const siteConfig = {
  name: "Australian Watch Guide",
  shortName: "AWG",
  tagline: "Trusted dealers, communities, and buying advice for the Australian watch scene.",
  description:
    "Your guide to watches in Australia. Find trusted dealers, explore enthusiast communities, and get advice for buying with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: "/images/heroes/bezel.webp",
  locale: "en_AU",
} as const;

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
