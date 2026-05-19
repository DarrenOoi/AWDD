import Link from "next/link";
import Image from "next/image";

import { FeaturedBadge } from "@/components/featured-badge";
import { StarRating } from "@/components/star-rating";
import type { Dealer } from "@/types/dealer";

type DealerResultRowProps = {
  dealer: Dealer;
};

export function DealerResultRow({ dealer }: DealerResultRowProps) {
  return (
    <article className="group flex gap-4 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200/60">
        <Image src={dealer.heroImage} alt={`${dealer.name} photo`} fill className="object-cover" />
        {dealer.featured ? (
          <FeaturedBadge size="sm" className="absolute left-1.5 top-1.5" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/dealers/${dealer.id}`}
          className="font-display text-lg font-semibold tracking-tight text-stone-900 underline-offset-2 hover:underline"
        >
          {dealer.name}
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
          <StarRating rating={dealer.googleRating} />
          {dealer.googleRating != null ? (
            <span className="text-stone-800">
              {dealer.googleRating.toFixed(1)}
              {dealer.reviewCount != null ? (
                <span className="text-stone-500"> ({dealer.reviewCount} reviews)</span>
              ) : null}
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm text-stone-600">
          {dealer.city}, {dealer.state}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-700">{dealer.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {dealer.brands.slice(0, 5).map((brand) => (
            <span
              key={brand}
              className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-700 ring-1 ring-stone-200/80"
            >
              {brand}
            </span>
          ))}
          {dealer.brands.length > 5 ? (
            <span className="text-xs text-stone-500">+{dealer.brands.length - 5} more</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
