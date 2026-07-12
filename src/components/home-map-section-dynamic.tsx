"use client";

import dynamic from "next/dynamic";

import { MapPlaceholder } from "@/components/deferred-dealer-map";
import { useInView } from "@/hooks/use-in-view";
import type { Dealer } from "@/types/dealer";

const HomeMapSection = dynamic(
  () => import("@/components/home-map-section").then((mod) => mod.HomeMapSection),
  {
    ssr: false,
    loading: () => (
      <MapPlaceholder heightClassName="h-[min(440px,62vh)] sm:h-[480px]" wrapperClassName="rounded-3xl" />
    ),
  },
);

type HomeMapSectionDynamicProps = {
  dealers: Dealer[];
};

export function HomeMapSectionDynamic({ dealers }: HomeMapSectionDynamicProps) {
  const { ref, inView } = useInView({ rootMargin: "320px 0px" });

  return (
    <div ref={ref} className="min-h-[min(440px,62vh)] sm:min-h-[480px]">
      {inView ? (
        <HomeMapSection dealers={dealers} />
      ) : (
        <MapPlaceholder heightClassName="h-[min(440px,62vh)] sm:h-[480px]" wrapperClassName="rounded-3xl" />
      )}
    </div>
  );
}
