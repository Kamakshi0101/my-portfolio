"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";

type AnimationVariant = "default" | "slideLeft" | "slideRight" | "scale" | "cinematic";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  variant?: AnimationVariant;
}

const variantMap: Record<AnimationVariant, Variants> = {
  default: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  cinematic: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
};

const transitionMap: Record<AnimationVariant, object> = {
  default: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  slideLeft: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  slideRight: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  cinematic: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
};

export default function SectionWrapper({
  children,
  className = "",
  id,
  delay = 0,
  variant = "default",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ ...transitionMap[variant], delay }}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  );
}
