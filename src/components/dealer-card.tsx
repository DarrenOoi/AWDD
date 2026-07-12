import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

import { FeaturedBadge } from "@/components/featured-badge";
import { StarRating } from "@/components/star-rating";
import type { Dealer } from "@/types/dealer";

type DealerCardProps = {
  dealer: Dealer;
  /** Set on the first above-the-fold card to improve LCP. */
  priorityImage?: boolean;
  /** Stagger index for home page scroll-reveal animation. */
  staggerIndex?: number;
};

export function DealerCard({ dealer, priorityImage = false, staggerIndex }: DealerCardProps) {
  const revealClass =
    staggerIndex != null ? "scroll-reveal-stagger" : undefined;
  const revealStyle =
    staggerIndex != null ? ({ "--stagger": staggerIndex } as CSSProperties) : undefined;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${revealClass ?? ""}`}
      style={revealStyle}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <Image
          src={dealer.heroImage}
          alt={`${dealer.name} hero`}
          fill
          priority={priorityImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {dealer.featured ? <FeaturedBadge size="md" className="absolute left-3 top-3" /> : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight text-stone-900">{dealer.name}</h3>

        <p className="mt-1 text-sm text-stone-600">
          {dealer.city}, {dealer.state}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-700">
          <StarRating rating={dealer.googleRating} />
          {dealer.googleRating != null ? (
            <span className="text-stone-800">
              {dealer.googleRating.toFixed(1)}
              {dealer.reviewCount != null ? (
                <span className="text-stone-500"> ({dealer.reviewCount})</span>
              ) : null}
            </span>
          ) : (
            <span className="text-stone-500">No rating yet</span>
          )}
        </div>

        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-stone-700">
          {dealer.description}
        </p>

        <div className="mt-4 flex min-h-[1.75rem] flex-wrap gap-2">
          {dealer.brands.slice(0, 4).map((brand) => (
            <span
              key={brand}
              className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-700 ring-1 ring-stone-200/80"
            >
              {brand}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Link
            href={`/dealers/${dealer.id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
}
