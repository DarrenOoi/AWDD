import type { Metadata } from "next";

import type { Dealer } from "@/types/dealer";

import { absoluteUrl, siteConfig } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
}: PageMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const url = absoluteUrl(canonical);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createDealerMetadata(dealer: Dealer): Metadata {
  const title = `${dealer.name} — Watch Dealer in ${dealer.city}, ${dealer.state}`;

  let description = `${dealer.name} is a watch dealer in ${dealer.city}, ${dealer.state}. ${dealer.description}`;
  if (dealer.googleRating != null && dealer.reviewCount != null) {
    description = `${dealer.name} — ${dealer.city}, ${dealer.state}. Rated ${dealer.googleRating.toFixed(1)} from ${dealer.reviewCount} Google reviews. ${dealer.description}`;
  }

  return createPageMetadata({
    title,
    description: description.slice(0, 160),
    path: `/dealers/${dealer.id}`,
    image: dealer.heroImage,
  });
}
