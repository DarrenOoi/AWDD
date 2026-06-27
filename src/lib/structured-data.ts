import type { Dealer } from "@/types/dealer";

import { absoluteUrl, siteConfig } from "./site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en-AU",
      },
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: siteConfig.shortName,
        url: absoluteUrl("/"),
        description: siteConfig.description,
      },
    ],
  };
}

export function dealerLocalBusinessJsonLd(dealer: Dealer) {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${absoluteUrl(`/dealers/${dealer.id}`)}#business`,
    name: dealer.name,
    description: dealer.description,
    image: absoluteUrl(dealer.heroImage),
    url: absoluteUrl(`/dealers/${dealer.id}`),
    telephone: dealer.phone,
    sameAs: [dealer.website, dealer.instagram].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: dealer.address,
      addressLocality: dealer.city,
      addressRegion: dealer.state,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: dealer.lat,
      longitude: dealer.lng,
    },
  };

  if (dealer.googleRating != null && dealer.reviewCount != null) {
    business.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: dealer.googleRating,
      reviewCount: dealer.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return business;
}

export function dealerBreadcrumbJsonLd(dealer: Dealer) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dealers",
        item: absoluteUrl("/dealers"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: dealer.name,
        item: absoluteUrl(`/dealers/${dealer.id}`),
      },
    ],
  };
}
