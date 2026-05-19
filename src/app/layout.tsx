import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { watchCommunities } from "@/data/watch-communities";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Australian Watch Dealer Directory",
  description: "Discover trusted watch dealers across Australia.",
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased [color-scheme:light]`}
    >
      <body className="flex min-h-full flex-col bg-[var(--bg-page)] text-stone-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[min(90rem,100%)] flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-stone-200/80 bg-[var(--bg-elevated)]">
          <div className="mx-auto grid w-full max-w-[min(90rem,100%)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
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
      </body>
    </html>
  );
}
