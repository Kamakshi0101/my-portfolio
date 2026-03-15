"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  gradient = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`
        relative glass rounded-2xl transition-all duration-300
        ${hover ? "cursor-pointer hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_30px_rgba(99,102,241,0.15)]" : ""}
        ${gradient ? "gradient-border" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
