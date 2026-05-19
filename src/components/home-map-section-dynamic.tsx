"use client";

import dynamic from "next/dynamic";

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
  return <HomeMapSection dealers={dealers} />;
}
