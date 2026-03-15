"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)",
          boxShadow: "0 0 12px rgba(99,102,241,0.8)",
        }}
      />
    </>
  );
}
