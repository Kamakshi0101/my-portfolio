"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedButton from "@/components/ui/AnimatedButton";
import socialsData from "@/data/socials.json";

const socialIcons: Record<string, React.ReactElement> = {
  GitHub: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Email: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  LeetCode: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.775-1.045-2.857-1.118-.708-.048-1.427.06-2.087.3z" />
    </svg>
  ),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};


export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setSubmitError(data?.error || "Unable to send message right now.");
        return;
      }

      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setSubmitError("Unable to send message right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="bg-dark-surface/30 relative overflow-hidden" variant="cinematic">
      {/* Ambient finale glow — pulsing background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 rounded-full bg-indigo-600/10 blur-[120px] ambient-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full bg-purple-600/10 blur-[100px] ambient-glow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Finale heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-pink-400 text-sm font-mono tracking-widest uppercase">// Get In Touch</span>
          <h2 className="section-heading gradient-text mt-2">Contact Me</h2>
          {/* Glowing CTA tagline */}
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-base">
            Open to opportunities, collaborations, and interesting conversations.
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-2 text-indigo-400/80 text-sm font-medium italic"
          >
            ✨ Let&apos;s build something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Info — staggered social icons */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white font-heading mb-2">Let&apos;s Build Something Together</h3>
              <p className="text-gray-400 leading-7">
                I&apos;m currently seeking internship and entry-level software engineering opportunities. Whether you have a project idea, a job opportunity, or just want to say hi — my inbox is always open!
              </p>
            </motion.div>

            {/* Social Links — staggered bounce-in */}
            <motion.div className="space-y-3" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {socialsData.socials.map((soc) => (
                <motion.a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden:   { opacity: 0, x: -30, scale: 0.95 },
                    visible:  { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
                  }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl border border-white/5 hover:border-white/20 group transition-all duration-300"
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${soc.color}20`, color: soc.color }}
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {socialIcons[soc.name] || <span className="text-lg">{soc.name[0]}</span>}
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{soc.name}</div>
                    <div className="text-xs text-gray-500 truncate">{soc.username}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Form — cascade reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-6 border border-white/10" hover={false}>
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                    animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 16px rgba(16,185,129,0.1)", "0 0 0 0 rgba(16,185,129,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white font-heading">Message Sent!</h3>
                  <p className="text-gray-400 mt-2">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                    className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Your Name", type: "text", key: "name" as const, placeholder: "John Doe" },
                    { label: "Email Address", type: "email", key: "email" as const, placeholder: "you@example.com" },
                  ].map((field) => (
                    <motion.div key={field.key} variants={itemVariants}>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{field.label}</label>
                      <input
                        type={field.type}
                        required
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/10 transition-all"
                      />
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project or opportunity..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AnimatedButton variant="primary" size="lg" className="w-full justify-center">
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : "Send Message 🚀"}
                    </AnimatedButton>
                  </motion.div>

                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </form>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
