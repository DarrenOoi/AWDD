"use client";

import dynamic from "next/dynamic";

import type { Dealer } from "@/types/dealer";

const DealerMap = dynamic(
  () => import("@/components/dealer-map").then((mod) => mod.DealerMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,50vh)] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 sm:h-[400px]">
        Loading map…
      </div>
    ),
  },
);

type DealerProfileMapProps = {
  dealer: Dealer;
};

export function DealerProfileMap({ dealer }: DealerProfileMapProps) {
  return (
    <DealerMap
      dealers={[dealer]}
      heightClassName="h-[min(420px,50vh)] sm:h-[400px]"
      markerPopup="google-maps"
    />
  );
}
