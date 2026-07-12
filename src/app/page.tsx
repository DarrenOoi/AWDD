import Link from "next/link";
import type { CSSProperties } from "react";

import { DealerCard } from "@/components/dealer-card";
import { HomeHero } from "@/components/home-hero";
import { HomeMapSectionDynamic } from "@/components/home-map-section-dynamic";
import { HomeStatsStripAnimated } from "@/components/home-stats-strip-animated";
import { dealers } from "@/data/dealers";
import { watchCommunities } from "@/data/watch-communities";
import { createPageMetadata } from "@/lib/metadata";

import "./home-polish.css";

export const metadata = createPageMetadata({
  title: "Find trusted watch dealers across Australia",
  description:
    "Your guide to watches in Australia. Browse trusted dealers by city and brand, compare ratings, and explore the map.",
  path: "/",
});

export default function Home() {
  const featuredDealers = dealers.filter((dealer) => dealer.featured).slice(0, 3);

  return (
    <div className="home-page space-y-16 sm:space-y-20">
      <HomeHero />

      <HomeStatsStripAnimated dealers={dealers} />

      <div className="scroll-reveal">
        <HomeMapSectionDynamic dealers={dealers} />
      </div>

      <section className="space-y-8">
        <div className="scroll-reveal flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Featured Dealers
            </h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Hand-picked storefronts and specialists worth knowing first.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredDealers.map((dealer, index) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              priorityImage={index === 0}
              staggerIndex={index}
            />
          ))}
        </div>
      </section>

      <section className="scroll-reveal rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Community</p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Facebook watch communities
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold sm:items-end">
            <Link href="/communities" className="text-accent hover:text-accent-hover">
              View all communities
            </Link>
            <Link href="/contact" className="text-stone-600 hover:text-stone-900">
              Contact us to add your community
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {watchCommunities.map((community, index) => (
            <a
              key={community.name}
              href={community.url}
              target="_blank"
              rel="noreferrer"
              className="community-card scroll-reveal-stagger block rounded-2xl border border-stone-200/80 bg-white p-4 hover:border-stone-300 hover:shadow-sm"
              style={{ "--stagger": index } as CSSProperties}
            >
              <p className="font-semibold text-stone-900">{community.name}</p>
              <p className="mt-1 text-sm text-stone-600">{community.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
