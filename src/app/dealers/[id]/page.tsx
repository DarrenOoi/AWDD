import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DealerContactDetails } from "@/components/dealer-contact-details";
import {
  DealerActionsReveal,
  DealerBrandPills,
  DealerContactReveal,
  DealerProfileContentMotion,
  DealerProfileHeroMotion,
  DealerProfileMapSection,
} from "@/components/dealer-profile-hero-motion";
import { DealerProfileActions } from "@/components/dealer-profile-actions";
import { DealerProfileMap } from "@/components/dealer-profile-map";
import { JsonLd } from "@/components/json-ld";
import { dealers } from "@/data/dealers";
import { createDealerMetadata } from "@/lib/metadata";
import { dealerBreadcrumbJsonLd, dealerLocalBusinessJsonLd } from "@/lib/structured-data";

type DealerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return dealers.map((dealer) => ({ id: dealer.id }));
}

export async function generateMetadata({ params }: DealerPageProps): Promise<Metadata> {
  const { id } = await params;
  const dealer = dealers.find((entry) => entry.id === id);

  if (!dealer) {
    return { title: "Dealer not found" };
  }

  return createDealerMetadata(dealer);
}

export default async function DealerPage({ params }: DealerPageProps) {
  const { id } = await params;
  const dealer = dealers.find((entry) => entry.id === id);

  if (!dealer) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <JsonLd data={[dealerLocalBusinessJsonLd(dealer), dealerBreadcrumbJsonLd(dealer)]} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dealers", href: "/dealers" },
          { label: dealer.name },
        ]}
      />

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
          <DealerProfileHeroMotion dealer={dealer} />
        </div>

        <DealerProfileContentMotion dealer={dealer}>
          <DealerContactReveal>
            <DealerContactDetails address={dealer.address} phone={dealer.phone} />
          </DealerContactReveal>

          <DealerBrandPills brands={dealer.brands} />

          <DealerActionsReveal>
            <DealerProfileActions website={dealer.website} instagram={dealer.instagram} />
          </DealerActionsReveal>
        </DealerProfileContentMotion>
      </section>

      <DealerProfileMapSection>
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900">Location</h2>
          <p className="mt-1 text-sm text-stone-600">Tap the pin for directions in Google Maps.</p>
        </div>
        <DealerProfileMap dealer={dealer} />
      </DealerProfileMapSection>
    </div>
  );
}
