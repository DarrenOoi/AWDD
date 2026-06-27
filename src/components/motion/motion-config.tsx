"use client";

import { MotionConfig } from "framer-motion";

export const editorialEase = [0.22, 1, 0.36, 1] as const;

export const revealTransition = {
  duration: 0.55,
  ease: editorialEase,
} as const;

export const staggerDelay = 0.08;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
