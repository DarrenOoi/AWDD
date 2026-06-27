import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">Page not found</h1>
      <p className="text-stone-600">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          Back to home
        </Link>
        <Link
          href="/dealers"
          className="inline-flex rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-50"
        >
          Browse dealers
        </Link>
      </div>
    </div>
  );
}
