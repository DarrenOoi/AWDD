"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";

import type { Dealer } from "@/types/dealer";

const HomeMapSection = dynamic(
  () => import("@/components/home-map-section").then((mod) => mod.HomeMapSection),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center text-sm text-stone-500">
        Loading map…
      </div>
    ),
  },
);

type HomeMapSectionDynamicProps = {
  dealers: Dealer[];
};

export function HomeMapSectionDynamic({ dealers }: HomeMapSectionDynamicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px 0px" });

  return (
    <div ref={ref} className="min-h-[12rem]">
      {inView ? (
        <HomeMapSection dealers={dealers} />
      ) : (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center text-sm text-stone-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
