"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import educationData from "@/data/education.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Image from "next/image";
import { IconSchool, IconBuildingBank } from "@tabler/icons-react";

const iconMap: Record<string, React.ElementType> = {
  university: IconBuildingBank,
  school: IconSchool,
};

export default function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-50px" });
  const [logoErrorMap, setLogoErrorMap] = useState<Record<number, boolean>>({});

  return (
    <SectionWrapper id="education" variant="cinematic">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-mono tracking-widest uppercase">{"// Background"}</span>
          <h2 className="section-heading gradient-text mt-2">Education</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            Academic journey shaping my knowledge and perspective.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Animated vertical line — grows downward on entry */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-indigo-500/70 via-purple-500/50 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-10">
            {educationData.education.map((edu, i) => {
              const isLeft = i % 2 === 0;
              const FallbackIcon = iconMap[edu.icon] || IconSchool;
              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline Dot — glows on entry */}
                  <motion.div
                    className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-2 md:-translate-x-2 flex items-center justify-center z-10 ${edu.current ? "border-indigo-400" : "border-purple-500"}`}
                    style={{ background: edu.current ? "#6366f1" : "#7c3aed" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.2 + 0.3 }}
                  >
                    {edu.current && (
                      <>
                        <span className="absolute w-8 h-8 rounded-full bg-indigo-400/20 animate-ping" />
                        <span className="absolute w-6 h-6 rounded-full bg-indigo-400/10 glow-pulse" />
                      </>
                    )}
                  </motion.div>

                  {/* Content Card */}
                  <div className={`ml-14 md:ml-0 md:w-[45%] ${isLeft ? "md:mr-auto md:pr-6" : "md:ml-auto md:pl-6"}`}>
                    <motion.div
                      className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300 group"
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.1)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: `${edu.color}15` }}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {edu.logo && !logoErrorMap[edu.id] ? (
                            <Image
                              src={edu.logo}
                              alt={`${edu.institution} logo`}
                              width={26}
                              height={26}
                              className="object-contain"
                              loading="lazy"
                              sizes="26px"
                              onError={() => setLogoErrorMap((prev) => ({ ...prev, [edu.id]: true }))}
                            />
                          ) : (
                            <FallbackIcon className="w-5 h-5" style={{ color: edu.color }} stroke={1.9} />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h3 className="font-bold text-white text-sm font-heading leading-5">{edu.degree}</h3>
                            {edu.current && (
                              <span className="text-xs text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full bg-green-500/10 shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-indigo-400 text-sm font-medium mt-1">{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-500">{edu.location}</span>
                            <span className="text-gray-700">·</span>
                            <span className="text-xs text-gray-500">{edu.period}</span>
                          </div>
                          <motion.div
                            className="mt-2 text-xs font-bold font-mono px-2 py-0.5 rounded-full inline-block"
                            style={{ color: edu.color, backgroundColor: `${edu.color}15` }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
                          >
                            {edu.grade}
                          </motion.div>
                          <p className="text-xs text-gray-400 mt-2 leading-5">{edu.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Year Badge (Desktop) */}
                  <motion.div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4"
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.4, type: "spring", stiffness: 300 }}
                  >
                    <div className="glass rounded-full px-3 py-1 text-xs font-mono text-gray-400 border border-white/10 whitespace-nowrap mt-8">
                      {edu.period.split(" – ")[0]}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
