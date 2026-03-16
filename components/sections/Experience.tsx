"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-dark-surface/20" variant="slideRight">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 text-sm font-mono tracking-widest uppercase">{"// Experience"}</span>
          <h2 className="section-heading gradient-text mt-2">Professional Experience</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
            Practical industry training with hands-on algorithmic implementation and structured software problem solving.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl border border-white/10 p-6 sm:p-8 gpu-boost"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">Summer Trainee</h3>
              <p className="text-indigo-300 mt-1 text-sm sm:text-base">ByteXL</p>
              <p className="text-gray-400 text-sm mt-1">Punjab, India · On-site</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-300 font-medium">Jun 2025 – Jul 2025</p>
              <p className="text-xs text-gray-500">2 months</p>
            </div>
          </div>

          <div className="space-y-3 text-gray-300 text-sm leading-7">
            <p>
              Completed summer training (DSA Module) by ByteXL and Lovely Professional University to strengthen understanding of programming fundamentals and core Data Structures and Algorithms.
            </p>
            <p>
              Worked on hands-on real-world projects, implementing advanced data structures, optimizing algorithms, and applying structured problem-solving techniques.
            </p>
            <p>
              Achieved an A+ grade and developed strong proficiency in algorithm design, efficient coding practices, and building practical applications.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium text-cyan-300 border border-cyan-500/30 bg-cyan-500/10">
              DSA
            </span>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-3">Certificate Preview</p>
            <a
              href="https://drive.google.com/file/d/10vDhlMvbbSW_HLIvkeCZmWxLQ6Wn8_Wo/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-white/10 hover:border-indigo-400/40 transition-colors"
            >
              <div className="relative w-full h-52 sm:h-64 bg-black/20">
                <Image
                  src="/certificates/bytexl-dsa.webp"
                  alt="ByteXL summer training certificate"
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
        </motion.article>
      </div>
    </SectionWrapper>
  );
}
