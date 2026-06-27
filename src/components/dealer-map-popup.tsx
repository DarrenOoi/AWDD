"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { StarRating } from "@/components/star-rating";
import type { Dealer } from "@/types/dealer";

type DealerMapPopupProps = {
  dealer: Dealer;
};

export function DealerMapPopup({ dealer }: DealerMapPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(260px,72vw)] overflow-hidden font-sans"
    >
      <div className="border-b border-stone-100 pb-3">
        <p className="font-display text-[15px] font-semibold leading-snug text-stone-900">{dealer.name}</p>
        <p className="mt-0.5 text-xs text-stone-500">
          {dealer.city}, {dealer.state}
        </p>
        {dealer.googleRating != null ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <StarRating rating={dealer.googleRating} size="sm" />
            <span className="text-xs font-medium text-stone-700">{dealer.googleRating.toFixed(1)}</span>
            {dealer.reviewCount != null ? (
              <span className="text-xs text-stone-500">({dealer.reviewCount} reviews)</span>
            ) : null}
          </div>
        ) : null}
      </div>

      {dealer.brands.length > 0 ? (
        <div className="flex flex-wrap gap-1 py-3">
          {dealer.brands.slice(0, 4).map((brand) => (
            <span
              key={brand}
              className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700"
            >
              {brand}
            </span>
          ))}
          {dealer.brands.length > 4 ? (
            <span className="self-center text-[11px] text-stone-500">+{dealer.brands.length - 4}</span>
          ) : null}
        </div>
      ) : null}

      <Link
        href={`/dealers/${dealer.id}`}
        className="flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground no-underline transition hover:bg-accent-hover"
      >
        View profile
      </Link>
    </motion.div>
  );
}
