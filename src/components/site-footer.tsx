import Link from "next/link";

import { dealers } from "@/data/dealers";
import { watchCommunities } from "@/data/watch-communities";

export function SiteFooter() {
  const featuredDealers = dealers.filter((dealer) => dealer.featured);

  return (
    <footer className="border-t border-stone-200/80 bg-[var(--bg-elevated)]">
      <div className="mx-auto grid w-full max-w-[min(90rem,100%)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-stone-900">AWDD</p>
          <p className="mt-2 text-sm text-stone-600">Australian watch dealers and enthusiast communities.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Quick links</p>
          <div className="mt-3 space-y-2 text-sm text-stone-700">
            <Link href="/" className="block hover:text-stone-900">
              Home
            </Link>
            <Link href="/dealers" className="block hover:text-stone-900">
              Dealers
            </Link>
            <Link href="/contact" className="block hover:text-stone-900">
              Contact us
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Featured dealers</p>
          <div className="mt-3 space-y-2 text-sm text-stone-700">
            {featuredDealers.map((dealer) => (
              <Link key={dealer.id} href={`/dealers/${dealer.id}`} className="block hover:text-stone-900">
                {dealer.name}
                <span className="text-stone-500">
                  {" "}
                  — {dealer.city}, {dealer.state}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Facebook communities</p>
          <div className="mt-3 space-y-2 text-sm text-stone-700">
            {watchCommunities.slice(0, 3).map((community) => (
              <a
                key={community.name}
                href={community.url}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-stone-900"
              >
                {community.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
