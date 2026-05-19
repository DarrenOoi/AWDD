import Link from "next/link";
import Image from "next/image";

import { DealerCard } from "@/components/dealer-card";
import { HomeMapSectionDynamic } from "@/components/home-map-section-dynamic";
import { dealers } from "@/data/dealers";
import { watchCommunities } from "@/data/watch-communities";

export default function Home() {
  const featuredDealers = dealers.filter((dealer) => dealer.featured).slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] px-6 py-14 shadow-sm sm:px-12 sm:py-20">
        <Image
          src="/images/heroes/bezel.webp"
          alt="Luxury watches arranged in a showroom"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,57,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(28,25,23,0.04),_transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Australia</p>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl">
            Find trusted watch dealers across Australia
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Curated listings — filter by city and brand on the directory, compare profiles, and explore dealers on
            the map.
          </p>

          <div className="mx-auto mt-10 flex justify-center">
            <Link
              href="/dealers"
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
            >
              Browse Dealers
            </Link>
          </div>

        
        </div>
      </section>

      <HomeMapSectionDynamic dealers={dealers} />

      <section className="space-y-8">
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

        <div className="grid gap-6 md:grid-cols-3">
          {featuredDealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </div>
      </section>

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
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {watchCommunities.map((community) => (
            <a
              key={community.name}
              href={community.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-stone-200/80 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm"
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
