"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlassCard from "@/components/ui/GlassCard";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTailwindcss,
  SiMongodb, SiPostgresql, SiMysql, SiDocker, SiGit, SiGithub,
  SiVercel, SiNginx, SiPython, SiJavascript, SiTypescript, SiCplusplus,
  SiLinux
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";

const iconMap: Record<string, React.ElementType> = {
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTailwindcss,
  SiMongodb, SiPostgresql, SiMysql, SiDocker, SiGit, SiGithub,
  SiVercel, SiNginx, SiPython, SiJavascript, SiTypescript, SiCplusplus,
  SiAmazonaws: FaAws, SiLinux,
  SiOpenjdk: FaJava,
};

const orbitRings = [
  {
    id: "inner",
    duration: 15,
    radius: 76,
    items: [
      { name: "React", icon: "SiReact", color: "#61DAFB", subtitle: "Frontend" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF", subtitle: "Framework" },
      { name: "Node.js", icon: "SiNodedotjs", color: "#339933", subtitle: "Backend" },
    ],
  },
  {
    id: "mid",
    duration: 25,
    radius: 126,
    items: [
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", subtitle: "Language" },
      { name: "MongoDB", icon: "SiMongodb", color: "#47A248", subtitle: "Database" },
      { name: "Docker", icon: "SiDocker", color: "#2496ED", subtitle: "Container" },
    ],
  },
  {
    id: "outer",
    duration: 40,
    radius: 176,
    items: [
      { name: "AWS", icon: "SiAmazonaws", color: "#FF9900", subtitle: "Cloud" },
      { name: "Git", icon: "SiGit", color: "#F05032", subtitle: "Version Control" },
      { name: "Tailwind", icon: "SiTailwindcss", color: "#06B6D4", subtitle: "Styling" },
    ],
  },
] as const;

const skillsByCategory = [
  {
    name: "Languages",
    items: ["C++", "JavaScript", "TypeScript", "Python", "Java"],
  },
  {
    name: "Frameworks",
    items: ["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"],
  },
  {
    name: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    name: "Tools & Platforms",
    items: ["Docker", "AWS", "Git", "GitHub", "Vercel", "Nginx", "Linux"],
  },
];

const skillMetaMap: Record<string, { icon: React.ElementType; color: string }> = {
  "c++": { icon: SiCplusplus, color: "#00599C" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  python: { icon: SiPython, color: "#3776AB" },
  java: { icon: FaJava, color: "#ED8B00" },
  "react.js": { icon: SiReact, color: "#61DAFB" },
  "next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  "express.js": { icon: SiExpress, color: "#FFFFFF" },
  "tailwind css": { icon: SiTailwindcss, color: "#06B6D4" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  mysql: { icon: SiMysql, color: "#4479A1" },
  docker: { icon: SiDocker, color: "#2496ED" },
  aws: { icon: FaAws, color: "#FF9900" },
  git: { icon: SiGit, color: "#F05032" },
  github: { icon: SiGithub, color: "#FFFFFF" },
  vercel: { icon: SiVercel, color: "#FFFFFF" },
  nginx: { icon: SiNginx, color: "#009639" },
  linux: { icon: SiLinux, color: "#FCC624" },
};

function getSkillMeta(skill: string) {
  return skillMetaMap[skill.toLowerCase()];
}

export default function Skills() {
  const [pausedOrbit, setPausedOrbit] = useState<string | null>(null);

  return (
    <SectionWrapper id="skills" variant="cinematic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-mono tracking-widest uppercase">{"// Tech Stack"}</span>
          <h2 className="section-heading gradient-text mt-2">Skills &amp; Technologies</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            Tools and technologies I use to bring ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-5 sm:p-6 border border-white/10" hover={false}>
              <div className="flex justify-center">
                <div
                  className="relative w-full"
                  style={{ maxWidth: "420px", width: "100%", aspectRatio: "1 / 1" }}
                >
                  {orbitRings.map((ring) => {
                    const isPaused = pausedOrbit === ring.id;
                    const ringSize = ring.radius * 2;
                    return (
                      <div
                        key={ring.id}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ width: `${ringSize}px`, height: `${ringSize}px` }}
                        onMouseEnter={() => setPausedOrbit(ring.id)}
                        onMouseLeave={() => setPausedOrbit((prev) => (prev === ring.id ? null : prev))}
                      >
                        <div
                          className="absolute inset-0 rounded-full border"
                          style={{
                            borderColor: "rgba(255,255,255,0.08)",
                            boxShadow: "0 0 20px rgba(124,108,255,0.15)",
                          }}
                        />

                        <div
                          className="absolute inset-0"
                          style={{
                            animationName: "spin",
                            animationDuration: `${ring.duration}s`,
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        >
                          {ring.items.map((tech, index) => {
                            const angle = (360 / ring.items.length) * index;
                            const Icon = iconMap[tech.icon] || SiReact;
                            return (
                              <div
                                key={tech.name}
                                className="absolute left-1/2 top-1/2 group/tech"
                                style={{ transform: `rotate(${angle}deg) translateY(-${ring.radius}px)` }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.08 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
                                  style={{
                                    background: "rgba(20,20,30,0.9)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                                    animationName: "spin",
                                    animationDuration: `${ring.duration}s`,
                                    animationTimingFunction: "linear",
                                    animationIterationCount: "infinite",
                                    animationDirection: "reverse",
                                    animationPlayState: isPaused ? "paused" : "running",
                                  }}
                                >
                                  <Icon className="w-7 h-7" style={{ color: tech.color }} />
                                </motion.div>

                                <div className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 border border-white/10 bg-black/85 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 z-20">
                                  <p className="text-[11px] text-white font-semibold leading-4 text-center">{tech.name}</p>
                                  <p className="text-[10px] text-gray-400 leading-4 text-center">{tech.subtitle}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      animate={{ boxShadow: ["0 0 16px rgba(99,102,241,0.25)", "0 0 35px rgba(99,102,241,0.45)", "0 0 16px rgba(99,102,241,0.25)"] }}
                      transition={{ duration: 3.2, repeat: Infinity }}
                      className="w-22 h-22 rounded-full border border-indigo-500/35 bg-[rgba(20,20,30,0.9)] flex items-center justify-center"
                    >
                      <span className="text-xs font-mono text-indigo-300 text-center leading-tight">Tech<br />Stack</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {skillsByCategory.map((category) => (
              <GlassCard key={category.name} className="p-5 border border-white/10" hover={false}>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3 font-mono">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-xs text-gray-200 bg-white/5 border border-white/10">
                      <span className="flex items-center gap-1.5">
                        {(() => {
                          const meta = getSkillMeta(skill);
                          if (!meta) return null;
                          const Icon = meta.icon;
                          return <Icon className="w-4 h-4 shrink-0" style={{ color: meta.color }} />;
                        })()}
                        <span>{skill}</span>
                      </span>
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
