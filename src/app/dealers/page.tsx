import Link from "next/link";
import { Suspense } from "react";

import { DealersDirectoryClient } from "@/components/dealers-directory-client";
import { dealers } from "@/data/dealers";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Find watch dealers in Australia",
  description:
    "Search Australian watch dealers by city, suburb, or name. Filter the guide and explore dealers on the map.",
  path: "/dealers",
});

export default function DealersPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-stone-200/80 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Dealers</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          Find watch dealers
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Search by dealer name or location, pick a city, or browse the map.
        </p>
      </header>

      <nav aria-label="All watch dealers" className="sr-only">
        <ul>
          {dealers.map((dealer) => (
            <li key={dealer.id}>
              <Link href={`/dealers/${dealer.id}`}>
                {dealer.name} — watch dealer in {dealer.city}, {dealer.state}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense
        fallback={
          <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-500">
            Loading dealers…
          </div>
        }
      >
        <DealersDirectoryClient dealers={dealers} />
      </Suspense>
    </div>
  );
}
