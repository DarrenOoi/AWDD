import Link from "next/link";

const navLinks = [
  { href: "/dealers", label: "Browse dealers" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[var(--bg-elevated)]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[min(90rem,100%)] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group min-w-0 shrink-0">
          <span className="font-display text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
            AWDD
          </span>
          <span className="mt-0.5 block truncate text-[10px] font-medium uppercase tracking-[0.16em] text-stone-500 sm:text-[11px] sm:tracking-[0.18em]">
            Australian Watch Dealer Directory
          </span>
        </Link>

        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 sm:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
