import Image from "next/image";

import { ContactForm } from "@/components/contact-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact us",
  description:
    "Get in touch with AWDD for dealer listing updates, corrections, or to add your watch community.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-10">
        <Image
          src="/images/heroes/contact-hero.webp"
          alt="Watch collectors discussing in a meetup"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Contact</p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            Have a dealer update, a correction, or a new watch community to add? Send us a message and we will
            review it.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8">
        <ContactForm />
      </section>
    </div>
  );
}
