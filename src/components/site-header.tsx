"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/dealers", label: "Browse dealers", shortLabel: "Dealers" },
  { href: "/contact", label: "Contact", shortLabel: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        paddingTop: scrolled ? 10 : 14,
        paddingBottom: scrolled ? 10 : 14,
        boxShadow: scrolled ? "0 1px 0 rgba(28,25,23,0.06), 0 4px 16px rgba(28,25,23,0.04)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-stone-200/80 bg-[var(--bg-elevated)]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[min(90rem,100%)] flex-nowrap items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="group min-w-0 flex-1 sm:flex-initial">
          <span className="font-display text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
            AWDD
          </span>
          <span className="mt-0.5 hidden truncate text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 sm:block">
            Australian Watch Dealer Directory
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2.5 bottom-1 h-0.5 rounded-full bg-accent sm:inset-x-4"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
