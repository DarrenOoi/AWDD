"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { FeaturedBadge } from "@/components/featured-badge";
import { editorialEase, revealTransition } from "@/components/motion/motion-config";
import { StarRating } from "@/components/star-rating";
import type { Dealer } from "@/types/dealer";

type DealerCardProps = {
  dealer: Dealer;
  index?: number;
  /** Set on the first above-the-fold card to improve LCP. */
  priorityImage?: boolean;
};

export function DealerCard({ dealer, index = 0, priorityImage = false }: DealerCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...revealTransition, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: editorialEase } }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] shadow-sm hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.45, ease: editorialEase }}
        >
          <Image
            src={dealer.heroImage}
            alt={`${dealer.name} hero`}
            fill
            priority={priorityImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover"
          />
        </motion.div>
        {dealer.featured ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={revealTransition}
          >
            <FeaturedBadge size="md" className="absolute left-3 top-3" />
          </motion.div>
        ) : null}
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
          {dealer.brands.slice(0, 4).map((brand, brandIndex) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: brandIndex * 0.04 }}
              className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-700 ring-1 ring-stone-200/80"
            >
              {brand}
            </motion.span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={`/dealers/${dealer.id}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
            >
              View profile
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
