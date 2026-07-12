import Link from "next/link";

import { watchCommunities } from "@/data/watch-communities";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Watch communities in Australia",
  description:
    "Explore Australian watch communities, including active Facebook groups and enthusiast forums for buying, selling, and learning.",
  path: "/communities",
});

export default function CommunitiesPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-stone-200/80 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Community</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          Watch communities in Australia
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Explore active groups and forums where Australian watch enthusiasts buy, sell, learn, and share advice.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {watchCommunities.map((community) => (
          <a
            key={community.name}
            href={community.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-stone-200/80 bg-[var(--bg-elevated)] p-5 shadow-sm transition hover:border-stone-300 hover:shadow-md"
          >
            <p className="font-semibold text-stone-900">{community.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{community.description}</p>
          </a>
        ))}
      </section>

      <section className="rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900">Know another good group?</h2>
        <p className="mt-2 max-w-2xl text-stone-600">
          If there is an Australian watch community we should add, send it through and we will review it.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
        >
          Suggest a community
        </Link>
      </section>
    </div>
  );
}
