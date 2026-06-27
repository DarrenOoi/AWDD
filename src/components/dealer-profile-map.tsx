"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "120px 0px" });

  return (
    <div ref={ref}>
      {inView ? (
        <DealerMap
          dealers={[dealer]}
          heightClassName="h-[min(420px,50vh)] sm:h-[400px]"
          markerPopup="google-maps"
        />
      ) : (
        <div className="flex h-[min(420px,50vh)] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 sm:h-[400px]">
          Loading map…
        </div>
      )}
    </div>
  );
}
