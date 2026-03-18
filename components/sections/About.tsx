"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

const AVATAR_SRC = "/avatar.jpg";

const textVariants = {
  hidden:   { opacity: 0, y: 30 },
  visible:  (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  // Parallax for the profile photo — moves slower than the page
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawPhotoY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const photoY = useSpring(rawPhotoY, { stiffness: 50, damping: 20 });

  return (
    <SectionWrapper id="about" className="bg-dark-surface/30">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-indigo-400 text-sm font-mono tracking-widest uppercase"
          >
            {"// About Me"}
          </motion.span>
          <h2 className="section-heading gradient-text mt-2">Who I Am</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            The story behind the code — my journey, passions, and what drives me.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Photo Side — parallax moves slower */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: photoY }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/10 blur-xl" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden glass border border-white/10">
                <Image
                  src={AVATAR_SRC}
                  alt="Kamakshi Aggarwal"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 288px, 384px"
                  loading="lazy"
                  onError={() => setAvatarLoadError(true)}
                />
                {avatarLoadError && (
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white text-8xl font-bold font-heading opacity-30">KA</span>
                  </div>
                )}
              </div>
              {/* Floating Label */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 border border-indigo-500/30"
              >
                <div className="text-sm font-medium text-white">Software Engineer</div>
                <div className="text-xs text-gray-400 mt-0.5">📍 Gurgaon, India</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Side — staggered line by line */}
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">
                A passionate developer who loves{" "}
                <span className="gradient-text">building things</span>
              </h3>
            </motion.div>

            <div className="space-y-4 text-gray-400 leading-7">
              {[
                <>I&apos;m <strong className="text-white">Kamakshi Aggarwal</strong>, a B.Tech Computer Science student at Lovely Professional University with a CGPA of 9.10 and a strong interest in backend systems, distributed architectures, and AI-driven applications.</>,
                <>I focus on building scalable software solutions using technologies such as <span className="text-indigo-400">React</span>, <span className="text-purple-400">Node.js</span>, <span className="text-cyan-400">MongoDB</span>, Docker, and AWS. My projects include SADHN, a microservices-based skill development platform with role-based access and real-time WebSocket notifications, and an AI-powered interview preparation platform designed to generate personalized learning workflows.</>,
                <>Alongside development, I actively practice DSA strengthening my algorithmic thinking and problem-solving skills.</>,
              ].map((para, i) => (
                <motion.p
                  key={i}
                  custom={i + 1}
                  variants={textVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Soft Skills Tags — staggered pop in */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {["Team Player", "Adaptability", "Problem-Solving", "Leadership", "Self-Learner"].map((skill) => (
                <motion.span
                  key={skill}
                  variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } } }}
                  className="px-3 py-1 rounded-full glass border border-white/10 text-sm text-gray-300"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
