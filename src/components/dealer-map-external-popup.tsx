import { googleMapsDirectionsUrl, googleMapsPlaceUrl } from "@/lib/dealer-search";
import type { Dealer } from "@/types/dealer";

type DealerMapExternalPopupProps = {
  dealer: Dealer;
};

export function DealerMapExternalPopup({ dealer }: DealerMapExternalPopupProps) {
  return (
    <div className="w-[min(240px,70vw)] font-sans">
      <p className="font-display text-[15px] font-semibold leading-snug text-stone-900">{dealer.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-600">{dealer.address}</p>
      <div className="mt-3 flex flex-col gap-2">
        <a
          href={googleMapsPlaceUrl(dealer)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground no-underline transition hover:bg-accent-hover"
        >
          Open in Google Maps
        </a>
        <a
          href={googleMapsDirectionsUrl(dealer)}
          target="_blank"
          rel="noreferrer"
          className="text-center text-xs font-medium text-accent underline underline-offset-2"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}
