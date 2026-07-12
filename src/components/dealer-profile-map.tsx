"use client";

import { DeferredDealerMap } from "@/components/deferred-dealer-map";
import type { Dealer } from "@/types/dealer";

const MAP_HEIGHT = "h-[min(420px,50vh)] sm:h-[400px]";

type DealerProfileMapProps = {
  dealer: Dealer;
};

export function DealerProfileMap({ dealer }: DealerProfileMapProps) {
  return (
    <DeferredDealerMap
      dealers={[dealer]}
      heightClassName={MAP_HEIGHT}
      markerPopup="google-maps"
    />
  );
}
