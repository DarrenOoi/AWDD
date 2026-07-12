import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200/80 bg-[var(--bg-elevated)]">
      <div className="mx-auto grid w-full max-w-[min(90rem,100%)] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-stone-900">{siteConfig.shortName}</p>
          <p className="mt-2 text-sm text-stone-600">{siteConfig.tagline}</p>
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
            <Link href="/communities" className="block hover:text-stone-900">
              Communities
            </Link>
            <Link href="/contact" className="block hover:text-stone-900">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
