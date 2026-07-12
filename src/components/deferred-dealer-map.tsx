"use client";

import dynamic from "next/dynamic";

import { useInView } from "@/hooks/use-in-view";
import type { Dealer } from "@/types/dealer";

const DealerMap = dynamic(
  () => import("@/components/dealer-map").then((mod) => mod.DealerMap),
  {
    ssr: false,
    loading: () => <MapPlaceholder heightClassName="h-full min-h-[inherit]" />,
  },
);

type DeferredDealerMapProps = {
  dealers: Dealer[];
  heightClassName: string;
  wrapperClassName?: string;
  defaultAustraliaView?: boolean;
  markerPopup?: "dealer" | "google-maps";
  /** When false, the map is not mounted (e.g. mobile list tab). */
  enabled?: boolean;
};

export function MapPlaceholder({
  heightClassName = "",
  wrapperClassName = "",
}: {
  heightClassName?: string;
  wrapperClassName?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 ${heightClassName} ${wrapperClassName}`}
      aria-hidden
    >
      Loading map…
    </div>
  );
}

export function DeferredDealerMap({
  dealers,
  heightClassName,
  wrapperClassName = "",
  defaultAustraliaView = false,
  markerPopup = "dealer",
  enabled = true,
}: DeferredDealerMapProps) {
  const { ref, inView } = useInView({ rootMargin: "240px 0px" });
  const shouldLoad = enabled && inView;

  return (
    <div ref={ref} className={`${heightClassName} ${wrapperClassName}`}>
      {shouldLoad ? (
        <DealerMap
          dealers={dealers}
          heightClassName="h-full min-h-[inherit]"
          wrapperClassName="h-full min-h-[inherit]"
          defaultAustraliaView={defaultAustraliaView}
          markerPopup={markerPopup}
        />
      ) : (
        <MapPlaceholder heightClassName="h-full min-h-[inherit]" />
      )}
    </div>
  );
}
