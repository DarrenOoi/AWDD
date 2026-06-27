import Link from "next/link";

import { DealerCard } from "@/components/dealer-card";
import { HomeHeroMotion } from "@/components/home-hero-motion";
import { HomeMapSectionDynamic } from "@/components/home-map-section-dynamic";
import { HomeStatsStrip } from "@/components/home-stats-strip";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/reveal";
import { dealers } from "@/data/dealers";
import { watchCommunities } from "@/data/watch-communities";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Find trusted watch dealers across Australia",
  description:
    "Browse curated Australian watch dealers by city and brand. Compare ratings, explore the map, and discover specialist storefronts.",
  path: "/",
});

export default function Home() {
  const featuredDealers = dealers.filter((dealer) => dealer.featured).slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20">
      <HomeHeroMotion />

      <HomeStatsStrip dealers={dealers} />

      <Reveal>
        <HomeMapSectionDynamic dealers={dealers} />
      </Reveal>

      <section className="space-y-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Featured Dealers
              </h2>
              <p className="mt-2 max-w-xl text-stone-600">
                Hand-picked storefronts and specialists worth knowing first.
              </p>
            </div>
          </div>
        </Reveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {featuredDealers.map((dealer, index) => (
            <StaggerItem key={dealer.id}>
              <DealerCard dealer={dealer} index={index} priorityImage={index === 0} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <Reveal>
        <section className="rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Community</p>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Facebook watch communities
              </h2>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-accent hover:text-accent-hover">
              Contact us to add your community
            </Link>
          </div>
          <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-2">
            {watchCommunities.map((community) => (
              <StaggerItem key={community.name}>
                <a
                  href={community.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-stone-200/80 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm"
                >
                  <p className="font-semibold text-stone-900">{community.name}</p>
                  <p className="mt-1 text-sm text-stone-600">{community.description}</p>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </Reveal>
    </div>
  );
}
