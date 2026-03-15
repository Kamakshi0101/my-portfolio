"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

/**
 * Returns a spring-smoothed scrollYProgress (0–1) scoped to a ref element.
 * The progress starts when the element enters the viewport and ends when it leaves.
 */
export function useSectionScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  return { ref, scrollYProgress: smoothProgress };
}

/**
 * Returns a parallax Y offset transform for a given scroll progress.
 * @param scrollYProgress - the motion value (0–1)
 * @param distance - how many pixels to move (positive = moves up as page scrolls down)
 */
export function useParallaxY(
  scrollYProgress: MotionValue<number>,
  distance: number = 80
): MotionValue<number> {
  return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
}
