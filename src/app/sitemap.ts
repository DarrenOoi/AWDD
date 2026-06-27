import type { MetadataRoute } from "next";

import { dealers } from "@/data/dealers";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/dealers"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.5 },
  ];

  const dealerRoutes: MetadataRoute.Sitemap = dealers.map((dealer) => ({
    url: absoluteUrl(`/dealers/${dealer.id}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...dealerRoutes];
}
