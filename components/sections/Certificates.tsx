"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import certificatesData from "@/data/certificates.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlassCard from "@/components/ui/GlassCard";

interface Certificate {
  id: number; title: string; organization: string; date: string;
  image: string; link: string; badge: string; color: string;
}

function CertModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="glass rounded-2xl p-6 max-w-lg w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: cert.color, backgroundColor: `${cert.color}20` }}>
                {cert.badge}
              </span>
              <h3 className="text-lg font-bold text-white font-heading mt-2">{cert.title}</h3>
              <p className="text-gray-400 text-sm">{cert.organization} · {cert.date}</p>
            </div>
            <button onClick={onClose} className="p-2 glass rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <motion.div
            className="w-full h-56 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${cert.color}15, ${cert.color}05)` }}
            animate={{ boxShadow: [`0 0 0 0 ${cert.color}00`, `0 0 30px 0 ${cert.color}30`, `0 0 0 0 ${cert.color}00`] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {!imageError ? (
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-contain bg-black/10"
                sizes="(max-width: 768px) 100vw, 560px"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center px-4">
                <div className="text-6xl mb-4">🎓</div>
                <div className="text-white font-bold text-lg font-heading">{cert.title}</div>
                <div className="text-gray-400 text-sm">{cert.organization}</div>
                <div className="mt-3 px-4 py-1 rounded-full text-sm font-medium" style={{ color: cert.color, border: `1px solid ${cert.color}40` }}>
                  {cert.badge}
                </div>
              </div>
            )}
          </motion.div>
          {cert.link && cert.link !== "#" && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border transition-colors text-sm font-medium hover:bg-white/5"
              style={{ borderColor: `${cert.color}40`, color: cert.color }}
            >
              View Certificate
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  return (
    <SectionWrapper id="certificates" variant="scale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-mono tracking-widest uppercase">{"// Credentials"}</span>
          <h2 className="section-heading gradient-text mt-2">Certificates</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            Professional certifications validating skills and expertise.
          </p>
        </motion.div>

        {/* Gallery wave reveal */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certificatesData.certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <GlassCard
                className="p-5 border hover:border-indigo-500/30 overflow-hidden h-full cursor-pointer"
                onClick={() => setSelected(cert as Certificate)}
              >
                {/* Icon area with scroll-in glow */}
                <motion.div
                  className="w-full h-28 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${cert.color}20, ${cert.color}05)` }}
                  whileHover={{
                    boxShadow: `0 0 24px 0 ${cert.color}40`,
                    background: `linear-gradient(135deg, ${cert.color}30, ${cert.color}10)`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {!brokenImages[cert.id] ? (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                      onError={() => setBrokenImages((prev) => ({ ...prev, [cert.id]: true }))}
                    />
                  ) : (
                    <motion.span
                      className="text-4xl"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      🎓
                    </motion.span>
                  )}
                </motion.div>

                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: cert.color, backgroundColor: `${cert.color}15` }}>
                  {cert.badge}
                </span>

                <h3 className="font-semibold text-white text-sm leading-5 mt-2 font-heading line-clamp-2">{cert.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cert.organization}</p>
                <p className="text-xs text-gray-600 mt-1">{cert.date}</p>

                <div className="mt-3 text-xs text-indigo-400 font-medium">Click to preview →</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </SectionWrapper>
  );
}
