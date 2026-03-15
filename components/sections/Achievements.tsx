"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import achievementsData from "@/data/achievements.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { IconCode, IconSchool, IconMedal, IconTrophy } from "@tabler/icons-react";

const iconMap: Record<string, React.ElementType> = {
  trophy: IconTrophy,
  academic: IconSchool,
  code: IconCode,
  medal: IconMedal,
};

const categoryStyleMap: Record<string, string> = {
  Competition: "text-violet-300 bg-violet-500/15",
  Academic: "text-amber-300 bg-amber-500/15",
  DSA: "text-emerald-300 bg-emerald-500/15",
  Certification: "text-slate-300 bg-slate-500/15",
};

export default function Achievements() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  return (
    <SectionWrapper id="achievements" className="bg-dark-surface/30" variant="slideLeft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-mono tracking-widest uppercase">// MILESTONES</span>
          <h2 className="section-heading gradient-text mt-2">Achievements</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mt-3 text-base">
            Recognition, milestones, and accomplishments that define my journey in academics, competitive programming, and technical competitions.
          </p>
          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Achievements Unlocked</span>
            <span className="text-sm font-semibold text-white">{achievementsData.achievements.length} Milestones</span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {achievementsData.achievements.map((item, i) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 26, scale: 0.92 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId((prev) => (prev === item.id ? null : prev))}
            >
              <motion.button
                type="button"
                aria-label={`View achievement details for ${item.title}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 bg-[rgba(20,20,30,0.9)]"
                style={{
                  borderColor: "rgba(124,108,255,0.4)",
                  boxShadow: "0 0 20px rgba(124,108,255,0.25)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ boxShadow: ["0 0 16px rgba(124,108,255,0.2)", "0 0 28px rgba(124,108,255,0.35)", "0 0 16px rgba(124,108,255,0.2)"] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.12 }}
                />
                {(() => {
                  const Icon = iconMap[item.icon] || IconTrophy;
                  return <Icon className="w-7 h-7 text-white relative z-10" stroke={1.8} />;
                })()}
              </motion.button>

              <div className="mt-3 text-center">
                <p className="text-xs font-medium text-gray-300 leading-5 max-w-40">{item.title}</p>
              </div>

              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-4 w-72.5 max-w-[90vw] rounded-[14px] p-4.5 border border-white/10"
                    style={{
                      background: "rgba(15,15,25,0.95)",
                      boxShadow: "0 15px 40px rgba(0,0,0,0.45)",
                    }}
                  >
                    <h3 className="text-sm font-semibold text-white font-heading leading-5">{item.title}</h3>
                    <div className="mt-2">
                      <span className={`inline-flex text-xs px-2.5 py-1 rounded-full ${categoryStyleMap[item.category] || "text-indigo-300 bg-indigo-500/15"}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-300">{item.description}</p>

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                      className="mt-3"
                    >
                      {item.image && !imageErrorMap[item.id] ? (
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden rounded-[10px] border"
                          style={{
                            borderColor: "rgba(255,255,255,0.08)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={`${item.title} visual proof`}
                            loading="lazy"
                            onError={() => setImageErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "200px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </motion.div>
                      ) : (
                        <div
                          className="rounded-[10px] border h-40 flex flex-col items-center justify-center bg-white/3 text-gray-400"
                          style={{
                            borderColor: "rgba(255,255,255,0.08)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
                          }}
                        >
                          {(() => {
                            const PlaceholderIcon = iconMap[item.icon] || IconTrophy;
                            return <PlaceholderIcon className="w-8 h-8 mb-2 text-gray-300" stroke={1.6} />;
                          })()}
                          <span className="text-[11px] font-mono tracking-wide uppercase text-gray-500">Image not available</span>
                        </div>
                      )}
                    </motion.div>

                    <div className="mt-3 text-xs text-gray-500 font-mono">{item.date}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
