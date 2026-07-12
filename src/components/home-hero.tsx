import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] px-6 py-14 shadow-sm sm:min-h-[26rem] sm:px-12 sm:py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-ken-burns absolute inset-0">
          <Image
            src="/images/heroes/bezel.webp"
            alt="Luxury watches arranged in a showroom"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,57,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(28,25,23,0.04),_transparent_50%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="hero-stagger hero-stagger-1 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Australia
        </p>
        <h1 className="hero-stagger hero-stagger-2 font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl">
          Find trusted watch dealers across Australia
        </h1>
        <p className="hero-stagger hero-stagger-3 mt-6 text-lg leading-relaxed text-stone-600">
          Your guide to buying watches in Australia — trusted dealers, communities, and advice.
        </p>
        <div className="hero-stagger hero-stagger-4 mx-auto mt-10 flex justify-center">
          <Link
            href="/dealers"
            className="cta-hover inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent-hover"
          >
            Browse Dealers
          </Link>
        </div>
      </div>
    </section>
  );
}
