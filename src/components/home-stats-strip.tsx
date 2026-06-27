"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { revealTransition } from "@/components/motion/motion-config";
import type { Dealer } from "@/types/dealer";

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [active, target, duration]);

  return value;
}

type HomeStatsStripProps = {
  dealers: Dealer[];
};

export function HomeStatsStrip({ dealers }: HomeStatsStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const cityCount = new Set(dealers.map((dealer) => `${dealer.city}, ${dealer.state}`)).size;
  const ratedDealers = dealers.filter((dealer) => dealer.googleRating != null);
  const avgRating =
    ratedDealers.length > 0
      ? ratedDealers.reduce((sum, dealer) => sum + (dealer.googleRating ?? 0), 0) / ratedDealers.length
      : 0;

  const dealerCount = useCountUp(dealers.length, inView);
  const cities = useCountUp(cityCount, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={revealTransition}
      className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] px-6 py-4 text-center shadow-sm sm:gap-x-12"
    >
      <StatItem label="Dealers listed" value={String(dealerCount)} />
      <Divider />
      <StatItem label="Cities covered" value={String(cities)} />
      {avgRating > 0 ? (
        <>
          <Divider />
          <StatItem label="Avg. Google rating" value={avgRating.toFixed(1)} />
        </>
      ) : null}
    </motion.div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="hidden h-8 w-px bg-stone-200 sm:block" aria-hidden />;
}
