"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { editorialEase, revealTransition } from "@/components/motion/motion-config";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function HomeHeroMotion() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-[var(--bg-elevated)] px-6 py-14 shadow-sm sm:px-12 sm:py-20">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image
          src="/images/heroes/bezel.webp"
          alt="Luxury watches arranged in a showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,57,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(28,25,23,0.04),_transparent_50%)]" />
      <motion.div
        className="relative mx-auto max-w-3xl text-center"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
      >
        <motion.p
          variants={itemVariants}
          transition={revealTransition}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-accent"
        >
          Australia
        </motion.p>
        <motion.h1
          variants={itemVariants}
          transition={revealTransition}
          className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl"
        >
          Find trusted watch dealers across Australia
        </motion.h1>
        <motion.p
          variants={itemVariants}
          transition={revealTransition}
          className="mt-6 text-lg leading-relaxed text-stone-600"
        >
          Curated listings — filter by city and brand on the directory, compare profiles, and explore dealers on
          the map.
        </motion.p>
        <motion.div variants={itemVariants} transition={revealTransition} className="mx-auto mt-10 flex justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ ease: editorialEase }}>
            <Link
              href="/dealers"
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
            >
              Browse Dealers
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
