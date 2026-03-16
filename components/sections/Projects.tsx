"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import projectsData from "@/data/projects.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";

const techColors: Record<string, string> = {
  "React.js": "#61DAFB",  "Node.js": "#339933",       "MongoDB": "#47A248",
  "Docker": "#2496ED",    "Express.js": "#94A3B8",     "Nginx": "#009639",
  "HTML": "#E34F26",      "Tailwind CSS": "#06B6D4",   "ReactJS": "#61DAFB",
  "NodeJS": "#339933",    "Express": "#94A3B8",         "Grok AI API": "#A855F7",
  "Next.js": "#FFFFFF",   "TypeScript": "#3178C6",     "Framer Motion": "#FF0055",
  "GSAP": "#88CE02",      "Three.js": "#000000",
};

interface Project {
  id: number; title: string; description: string; shortDescription: string;
  tech: string[]; type: string; device: string; github: string;
  demo: string; image: string; featured: boolean; period: string;
}

function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

function ProjectDeviceFallback({ device, className = "text-4xl" }: { device: string; className?: string }) {
  return (
    <span className={className}>
      {device === "server" ? "🖥️" : device === "laptop" ? "💻" : "📱"}
    </span>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs text-indigo-400 font-mono uppercase tracking-widest">{project.type}</span>
              <h3 className="text-xl font-bold text-white font-heading mt-1">{project.title}</h3>
              <span className="text-xs text-gray-500">{project.period}</span>
            </div>
            <button onClick={onClose} className="p-2 glass rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full h-40 rounded-xl bg-linear-to-br from-indigo-900/40 via-purple-900/40 to-cyan-900/40 border border-white/5 flex items-center justify-center mb-4 overflow-hidden relative">
            {!imageError ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                fetchPriority="high"
                onError={() => setImageError(true)}
              />
            ) : (
              <ProjectDeviceFallback device={project.device} />
            )}
          </div>

          <p className="text-gray-300 leading-7 text-sm mb-4">{project.description}</p>

          <div className="mb-6">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium glass border border-white/10" style={{ color: techColors[t] || "#94a3b8" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <AnimatedButton variant="primary" size="sm" href={project.github}
              icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>}
            >GitHub</AnimatedButton>
            {project.demo && project.demo !== "#" && (
              <AnimatedButton variant="outline" size="sm" href={project.demo}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
              >Live Demo</AnimatedButton>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 group cursor-pointer transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(99,102,241,0.15)]"
      onClick={onClick}
      onMouseEnter={() => preloadImage(project.image)}
      onFocus={() => preloadImage(project.image)}
      onTouchStart={() => preloadImage(project.image)}
    >
      {/* Image */}
      <div className="relative h-44 bg-linear-to-br from-indigo-900/40 via-purple-900/40 to-cyan-900/40 overflow-hidden">
        {!imageError ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2}
            onError={() => setImageError(true)}
          />
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectDeviceFallback device={project.device} className="text-6xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        {project.featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 px-2 py-1 rounded-full bg-indigo-500/80 text-white text-xs font-medium"
          >
            Featured
          </motion.div>
        )}
        <div className="absolute bottom-3 left-3 text-xs text-gray-400 glass px-2 py-1 rounded-full">{project.period}</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-indigo-400 font-mono uppercase tracking-wider">{project.type}</span>
        </div>
        <h3 className="font-bold text-white font-heading mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
        <p className="text-sm text-gray-400 leading-5 mb-4 line-clamp-3">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-xs glass border border-white/5" style={{ color: techColors[t] || "#94a3b8" }}>
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-xs text-gray-500">+{project.tech.length - 4}</span>
          )}
        </div>

        <div className="flex gap-2">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Code
          </a>
          <span className="text-gray-600">•</span>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View Details →</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = () => {
      projectsData.projects.slice(0, 3).forEach((project) => preloadImage(project.image));
    };

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(run);
      return () => cancelIdleCallback(id);
    }

    const t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, []);

  // Subtle background color shift as section scrolls into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.06]);

  return (
    <SectionWrapper id="projects" className="bg-dark-surface/20" variant="default">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Scroll-driven spotlight gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(99,102,241,1), rgba(168,85,247,1))",
            opacity: bgOpacity,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-mono tracking-widest uppercase">{"// Work"}</span>
          <h2 className="section-heading gradient-text mt-2">Featured Projects</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            Production-ready applications showcasing full-stack engineering and AI integration.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project as Project}
              onClick={() => {
                preloadImage((project as Project).image);
                setSelectedProject(project as Project);
              }}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <AnimatedButton
            variant="outline"
            href="https://github.com/kamakshi0101"
            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>}
          >
            View All on GitHub
          </AnimatedButton>
        </motion.div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </SectionWrapper>
  );
}
