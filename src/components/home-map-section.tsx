"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { DealerMap } from "@/components/dealer-map";
import type { Dealer } from "@/types/dealer";

type HomeMapSectionProps = {
  dealers: Dealer[];
};

export function HomeMapSection({ dealers }: HomeMapSectionProps) {
  return (
    <section className="rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Explore</p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Every dealer on the map
            </h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Pan and zoom with Google Maps — tap a pin for a quick preview, or use Browse directory for filters and list
              view.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dealers"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
            >
              View List
            </Link>
          </motion.div>
        </div>
      </Reveal>
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <DealerMap
          dealers={dealers}
          heightClassName="h-[min(440px,62vh)] sm:h-[480px]"
          defaultAustraliaView
        />
      </motion.div>
    </section>
  );
}
