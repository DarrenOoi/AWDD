"use client";

import { motion } from "framer-motion";

import { FeaturedBadge } from "@/components/featured-badge";
import { revealTransition } from "@/components/motion/motion-config";
import { StarRating } from "@/components/star-rating";
import type { Dealer } from "@/types/dealer";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type DealerProfileHeroMotionProps = {
  dealer: Dealer;
};

export function DealerProfileHeroMotion({ dealer }: DealerProfileHeroMotionProps) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 p-6 sm:p-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
    >
      {dealer.featured ? (
        <motion.div variants={itemVariants} transition={revealTransition}>
          <FeaturedBadge className="mb-3" />
        </motion.div>
      ) : null}
      <motion.p
        variants={itemVariants}
        transition={revealTransition}
        className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300"
      >
        Dealer
      </motion.p>
      <motion.h1
        variants={itemVariants}
        transition={revealTransition}
        className="font-display mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {dealer.name}
      </motion.h1>
      <motion.p variants={itemVariants} transition={revealTransition} className="mt-2 text-stone-200">
        {dealer.city}, {dealer.state}
      </motion.p>
      <motion.div
        variants={itemVariants}
        transition={revealTransition}
        className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-100"
      >
        <StarRating rating={dealer.googleRating} size="md" />
        {dealer.googleRating != null ? (
          <span>
            {dealer.googleRating.toFixed(1)}
            {dealer.reviewCount != null ? (
              <span className="text-stone-300"> · {dealer.reviewCount} Google reviews</span>
            ) : null}
          </span>
        ) : (
          <span className="text-stone-300">No public rating yet</span>
        )}
      </motion.div>
    </motion.div>
  );
}

type DealerProfileContentMotionProps = {
  dealer: Dealer;
  children: React.ReactNode;
};

export function DealerProfileContentMotion({ dealer, children }: DealerProfileContentMotionProps) {
  return (
    <motion.div
      className="space-y-6 p-6 sm:p-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
    >
      <motion.p
        variants={itemVariants}
        transition={revealTransition}
        className="max-w-3xl text-lg leading-relaxed text-stone-700"
      >
        {dealer.description}
      </motion.p>
      {children}
    </motion.div>
  );
}

export function DealerBrandPills({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null;

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {brands.map((brand) => (
        <motion.span
          key={brand}
          variants={itemVariants}
          transition={revealTransition}
          className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-800 ring-1 ring-stone-200/80"
        >
          {brand}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function DealerProfileMapSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={revealTransition}
    >
      {children}
    </motion.section>
  );
}

export function DealerContactReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} transition={revealTransition}>
      {children}
    </motion.div>
  );
}

export function DealerActionsReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} transition={revealTransition}>
      {children}
    </motion.div>
  );
}
