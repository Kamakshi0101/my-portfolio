"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "glow";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  download?: boolean;
}

export default function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
  download = false,
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
    outline:
      "glass border border-indigo-500/40 text-indigo-400 hover:border-indigo-400 hover:text-white hover:bg-indigo-500/10",
    ghost:
      "text-gray-400 hover:text-white hover:bg-white/5",
    glow:
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
  };

  const baseClasses = `
    inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const ButtonContent = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        href={href}
        className={baseClasses}
        target={download ? "_self" : "_blank"}
        rel="noopener noreferrer"
        download={download}
      >
        {ButtonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={baseClasses}
    >
      {ButtonContent}
    </motion.button>
  );
}
