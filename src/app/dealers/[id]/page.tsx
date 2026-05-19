import Image from "next/image";
import { notFound } from "next/navigation";

import { DealerContactDetails } from "@/components/dealer-contact-details";
import { DealerProfileActions } from "@/components/dealer-profile-actions";
import { DealerProfileMap } from "@/components/dealer-profile-map";
import { FeaturedBadge } from "@/components/featured-badge";
import { StarRating } from "@/components/star-rating";
import { dealers } from "@/data/dealers";

type DealerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealerPage({ params }: DealerPageProps) {
  const { id } = await params;
  const dealer = dealers.find((entry) => entry.id === id);

  if (!dealer) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] shadow-sm">
        <div className="relative aspect-[2.2/1] min-h-[200px] w-full sm:aspect-[2.8/1]">
          <Image
            src={dealer.heroImage}
            alt={`${dealer.name} storefront`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/35 to-stone-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            {dealer.featured ? <FeaturedBadge className="mb-3" /> : null}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">Dealer</p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {dealer.name}
            </h1>
            <p className="mt-2 text-stone-200">
              {dealer.city}, {dealer.state}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-100">
              <StarRating rating={dealer.googleRating} size="md" />
              {dealer.googleRating != null ? (
                <span>
                  {dealer.googleRating.toFixed(1)}
                  {dealer.reviewCount != null ? (
                    <span className="text-stone-300"> · {dealer.reviewCount} Google reviews</span>
                  ) : null}
                </span>
              ) : (
                <span className="text-stone-300">No public rating yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <p className="max-w-3xl text-lg leading-relaxed text-stone-700">{dealer.description}</p>

          <DealerContactDetails address={dealer.address} phone={dealer.phone} />

          {dealer.brands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dealer.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-800 ring-1 ring-stone-200/80"
                >
                  {brand}
                </span>
              ))}
            </div>
          ) : null}

          <DealerProfileActions
            dealerName={dealer.name}
            website={dealer.website}
            instagram={dealer.instagram}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900">Location</h2>
          <p className="mt-1 text-sm text-stone-600">Tap the pin for directions in Google Maps.</p>
        </div>
        <DealerProfileMap dealer={dealer} />
      </section>
    </div>
  );
}
