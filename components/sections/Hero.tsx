"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Image from "next/image";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiDocker,
  SiCplusplus,
  SiMongodb,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const typingPhrases = [
  "Backend Developer",
  "Competitive Programmer",
  "Full Stack Engineer",
  "AI Enthusiast",
  "Problem Solver",
];

const AVATAR_SRC = "/avatar.jpg";

const floatingIcons = [
  { icon: SiReact, label: "React", color: "#61DAFB", delay: 0, x: "15%", y: "20%" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6", delay: 1, x: "80%", y: "15%" },
  { icon: SiPython, label: "Python", color: "#3776AB", delay: 2, x: "10%", y: "75%" },
  { icon: SiNodedotjs, label: "Node.js", color: "#339933", delay: 0.5, x: "85%", y: "70%" },
  { icon: SiDocker, label: "Docker", color: "#2496ED", delay: 1.5, x: "20%", y: "50%" },
  { icon: SiCplusplus, label: "C++", color: "#00599C", delay: 2.5, x: "75%", y: "45%" },
  { icon: FaAws, label: "AWS", color: "#FF9900", delay: 3, x: "50%", y: "10%" },
  { icon: SiMongodb, label: "MongoDB", color: "#47A248", delay: 0.8, x: "90%", y: "35%" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  // Spring-smoothed parallax
  const rawY       = useTransform(scrollY, [0, 700], [0, 120]);
  const rawOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const rawScale   = useTransform(scrollY, [0, 500], [1, 0.96]);
  const y       = useSpring(rawY,       { stiffness: 60, damping: 20 });
  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });
  const scale   = useSpring(rawScale,   { stiffness: 60, damping: 20 });

  // Icons fade out faster as user scrolls
  const iconsOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const iconsY       = useTransform(scrollY, [0, 300], [0, -60]);

  // Typing animation
  useEffect(() => {
    const speed = isDeleting ? 40 : 80;
    const phrase = typingPhrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < phrase.length) {
        setDisplayText(phrase.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(phrase.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else if (!isDeleting && charIndex === phrase.length) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % typingPhrases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.25),transparent_50%)]" />

      {/* Glowing Orbs (hero-specific) */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"
      />

      {/* Floating Tech Icons — parallax out when scrolling */}
      <motion.div
        style={{ opacity: iconsOpacity, y: iconsY }}
        className="absolute inset-0 pointer-events-none"
      >
        {floatingIcons.map((item, i) => (
          <motion.div
            key={item.label}
            className="absolute hidden md:flex items-center gap-1 glass rounded-full px-3 py-1.5 text-sm select-none"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10 - i * 2, 0],
            }}
            transition={{
              opacity: { delay: item.delay + 1, duration: 0.5 },
              scale:   { delay: item.delay + 1, duration: 0.5 },
              y: { delay: item.delay, duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
            <span className="text-xs text-gray-400">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content — spring parallax upward as user scrolls */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20 pb-10"
      >
        {/* Text Content with staggered entrance */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-indigo-400 border border-indigo-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="section-heading mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Hello, I&apos;m{" "}
            <span className="gradient-text">Kamakshi</span>
            <br />
            <span className="text-white dark:text-white">Aggarwal</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-2 h-8 font-medium"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <span className="gradient-text">{displayText}</span>
            <span className="inline-block w-0.5 h-6 bg-indigo-400 ml-1 animate-blink" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 max-w-xl mx-auto lg:mx-0 text-base leading-7 mt-4 mb-8"
          >
            BTech CSE student at <span className="text-indigo-400 font-medium">Lovely Professional University</span> with CGPA 9.10.{" "}
            Passionate about building scalable backend systems, solving algorithmic challenges, and creating meaningful digital experiences.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m0 0l7-7m-7 7l7 7" />
                </svg>
              }
            >
              View Projects
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="lg"
              href="/resume.pdf"
              download
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Download CV
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="lg"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Me
            </AnimatedButton>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 justify-center lg:justify-start mt-10"
          >
            {[
              { label: "CGPA",            value: "9.10" },
              { label: "Problems Solved", value: "300+" },
              { label: "Projects",        value: "5+"   },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text font-heading">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="shrink-0 relative"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-dashed border-purple-500/20"
            />

            {/* Glow */}
            <div className="absolute inset-8 rounded-full bg-linear-to-br from-indigo-600/40 via-purple-600/30 to-cyan-600/20 blur-2xl" />

            {/* Photo */}
            <div className="absolute inset-8 rounded-full overflow-hidden glass border-2 border-white/10 shadow-2xl shadow-indigo-500/20">
              <Image
                src={AVATAR_SRC}
                alt="Kamakshi Aggarwal"
                fill
                className="object-cover object-center"
                unoptimized
                priority
                onError={() => setAvatarLoadError(true)}
              />
              {/* Gradient Fallback */}
              {avatarLoadError && (
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-cyan-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold font-heading opacity-50">KA</span>
                </div>
              )}
            </div>

            {/* Corner Badges */}
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-4 -right-2 glass rounded-xl px-3 py-2 border border-green-500/30">
              <div className="text-xs text-green-400 font-mono">CGPA 9.10</div>
            </motion.div>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-4 -left-2 glass rounded-xl px-3 py-2 border border-purple-500/30">
              <div className="text-xs text-purple-400 font-mono">BTech CSE</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-gray-600/60 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ height: ["30%", "60%", "30%"], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1 rounded-full bg-indigo-400"
          />
        </motion.div>
        {/* Chevrons */}
        <motion.div className="flex flex-col items-center -mt-1">
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              className="w-4 h-3 text-indigo-400/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
