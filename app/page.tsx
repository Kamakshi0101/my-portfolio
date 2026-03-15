"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import CodingDashboard from "@/components/sections/CodingDashboard";
import Certificates from "@/components/sections/Certificates";
import Achievements from "@/components/sections/Achievements";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Terminal from "@/components/terminal/Terminal";
import ScrollProgress from "@/components/ui/ScrollProgress";

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-gray-600 text-sm font-mono">
          <span className="gradient-text font-bold">Kamakshi Aggarwal</span>
          {" · "}
          Built with Next.js, Framer Motion & 💜
          {" · "}
          <span className="text-indigo-500">2026</span>
        </p>
      </div>
    </footer>
  );
}

function ParallaxOrbs() {
  const { scrollY } = useScroll();
  const y1Raw = useTransform(scrollY, [0, 3000], [0, -600]);
  const y2Raw = useTransform(scrollY, [0, 3000], [0, -300]);
  const y1 = useSpring(y1Raw, { stiffness: 30, damping: 20 });
  const y2 = useSpring(y2Raw, { stiffness: 20, damping: 25 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top-left orb — moves faster (parallax depth illusion) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full bg-indigo-600 blur-[160px]" />
      </motion.div>

      {/* Bottom-right orb — moves slower */}
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.13, 0.07] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <div className="w-full h-full rounded-full bg-purple-600 blur-[140px]" />
      </motion.div>

      {/* Mid floating orb — cyan accent */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.07, 0.03], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <div className="w-full h-full rounded-full bg-cyan-500 blur-[120px]" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Parallax Background Orbs */}
      <ParallaxOrbs />

      <div className="relative z-10">
        <Navbar onTerminalOpen={() => setTerminalOpen(true)} />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CodingDashboard />
        <Certificates />
        <Achievements />
        <Education />
        <Contact />
        <Footer />
      </div>

      {/* Interactive Terminal Mode */}
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </main>
  );
}
