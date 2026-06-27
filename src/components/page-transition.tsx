"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { revealTransition } from "@/components/motion/motion-config";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [animateState, setAnimateState] = useState({ opacity: 1, y: 0 });

  useEffect(() => {
    if (prevPathname.current === pathname) return;

    prevPathname.current = pathname;
    setAnimateState({ opacity: 0, y: 8 });

    const frame = requestAnimationFrame(() => {
      setAnimateState({ opacity: 1, y: 0 });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <motion.div initial={false} animate={animateState} transition={revealTransition}>
      {children}
    </motion.div>
  );
}
