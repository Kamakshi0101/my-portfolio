"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import certificatesData from "@/data/certificates.json";
import achievementsData from "@/data/achievements.json";
import educationData from "@/data/education.json";
import socialsData from "@/data/socials.json";

type OutputLine = {
  type: "command" | "output" | "error" | "success" | "info" | "blank";
  content: string | string[];
};

const WELCOME_LINES: OutputLine[] = [
  { type: "info", content: "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄" },
  { type: "info", content: "  Kamakshi Aggarwal — Portfolio Terminal  " },
  { type: "info", content: "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀" },
  { type: "blank", content: "" },
  { type: "output", content: 'Type "help" to see all available commands.' },
  { type: "blank", content: "" },
];

function processCommand(input: string): OutputLine[] {
  const parts = input.trim().toLowerCase().split(" ");
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case "help":
      return [
        { type: "success", content: "Available Commands:" },
        { type: "blank", content: "" },
        { type: "output", content: "  about          → Learn about me" },
        { type: "output", content: "  skills         → View my tech stack" },
        { type: "output", content: "  projects        → List my projects" },
        { type: "output", content: "  project [n]    → View project details" },
        { type: "output", content: "  certificates   → View certifications" },
        { type: "output", content: "  achievements   → See accomplishments" },
        { type: "output", content: "  education      → View education history" },
        { type: "output", content: "  contact        → Contact information" },
        { type: "output", content: "  resume         → Download CV" },
        { type: "output", content: "  clear           → Clear terminal" },
        { type: "blank", content: "" },
      ];

    case "about":
      return [
        { type: "success", content: "About Kamakshi Aggarwal:" },
        { type: "blank", content: "" },
        { type: "output", content: "  Hi! I'm a BTech CSE student at Lovely Professional University" },
        { type: "output", content: "  with a CGPA of 9.10, ranked among top 25 students." },
        { type: "blank", content: "" },
        { type: "output", content: "  Focus Areas:" },
        { type: "output", content: "  → Backend Development (Microservices, REST APIs, WebSockets)" },
        { type: "output", content: "  → Competitive Programming (LeetCode, GFG, HackerRank)" },
        { type: "output", content: "  → AI & Data Systems" },
        { type: "output", content: "  → Full Stack Engineering (React, Node.js, MongoDB)" },
        { type: "blank", content: "" },
        { type: "info", content: "  📍 Location : Punjab, India" },
        { type: "info", content: "  📧 Email    : kamakshiagg2005@gmail.com" },
        { type: "blank", content: "" },
      ];

    case "skills":
      return [
        { type: "success", content: "Tech Stack:" },
        { type: "blank", content: "" },
        ...skillsData.categories.map((cat) => ({
          type: "output" as const,
          content: `  ${cat.name.padEnd(20)}: ${cat.skills.map((s) => s.name).join(", ")}`,
        })),
        { type: "blank", content: "" },
      ];

    case "projects": {
      const lines: OutputLine[] = [
        { type: "success", content: "Projects:" },
        { type: "blank", content: "" },
      ];
      projectsData.projects.forEach((p, i) => {
        lines.push({ type: "output", content: `  ${i + 1}. ${p.title}` });
        lines.push({ type: "info", content: `     ${p.shortDescription.slice(0, 70)}...` });
        lines.push({ type: "blank", content: "" });
      });
      lines.push({ type: "output", content: '  → Type "project [n]" to view details' });
      lines.push({ type: "blank", content: "" });
      return lines;
    }

    case "project": {
      const idx = parseInt(args[0]) - 1;
      if (isNaN(idx) || idx < 0 || idx >= projectsData.projects.length) {
        return [
          { type: "error", content: `  Project ${args[0]} not found.` },
          { type: "output", content: `  Valid range: 1–${projectsData.projects.length}` },
          { type: "blank", content: "" },
        ];
      }
      const p = projectsData.projects[idx];
      return [
        { type: "success", content: `Project ${idx + 1}: ${p.title}` },
        { type: "blank", content: "" },
        { type: "info", content: `  Period: ${p.period}` },
        { type: "info", content: `  Type  : ${p.type}` },
        { type: "blank", content: "" },
        { type: "output", content: "  Description:" },
        { type: "output", content: `  ${p.description.slice(0, 150)}...` },
        { type: "blank", content: "" },
        { type: "output", content: `  Tech   : ${p.tech.join(", ")}` },
        { type: "output", content: `  GitHub : ${p.github}` },
        { type: "blank", content: "" },
      ];
    }

    case "certificates": {
      const lines: OutputLine[] = [
        { type: "success", content: "Certificates:" },
        { type: "blank", content: "" },
      ];
      certificatesData.certificates.forEach((c) => {
        lines.push({ type: "output", content: `  • ${c.title}` });
        lines.push({ type: "info", content: `      ${c.organization} — ${c.date}  [${c.badge}]` });
      });
      lines.push({ type: "blank", content: "" });
      return lines;
    }

    case "achievements": {
      const lines: OutputLine[] = [
        { type: "success", content: "Achievements:" },
        { type: "blank", content: "" },
      ];
      achievementsData.achievements.forEach((a) => {
        lines.push({ type: "output", content: `  • ${a.title}  (${a.date})` });
        lines.push({ type: "info", content: `      ${a.description.slice(0, 80)}` });
        lines.push({ type: "blank", content: "" });
      });
      return lines;
    }

    case "education": {
      const lines: OutputLine[] = [
        { type: "success", content: "Education:" },
        { type: "blank", content: "" },
      ];
      educationData.education.forEach((e) => {
        lines.push({ type: "output", content: `  ${e.degree}` });
        lines.push({ type: "info", content: `  ${e.institution}, ${e.location}` });
        lines.push({ type: "info", content: `  Period: ${e.period}  |  Grade: ${e.grade}` });
        lines.push({ type: "blank", content: "" });
      });
      return lines;
    }

    case "contact":
      return [
        { type: "success", content: "Contact Information:" },
        { type: "blank", content: "" },
        { type: "output", content: `  📧 Email    : ${socialsData.email}` },
        { type: "output", content: `  📱 Phone    : ${socialsData.phone}` },
        { type: "output", content: `  🐙 GitHub   : ${socialsData.socials.find(s => s.name === "GitHub")?.url}` },
        { type: "output", content: `  💼 LinkedIn : ${socialsData.socials.find(s => s.name === "LinkedIn")?.url}` },
        { type: "blank", content: "" },
      ];

    case "resume":
      // Trigger download via creating a temp link
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Kamakshi_Aggarwal_Resume.pdf";
        link.click();
      }
      return [
        { type: "success", content: "  Downloading resume..." },
        { type: "output", content: "  Kamakshi_Aggarwal_Resume.pdf" },
        { type: "blank", content: "" },
      ];

    case "clear":
      return [{ type: "blank", content: "__CLEAR__" }];

    case "":
      return [{ type: "blank", content: "" }];

    default:
      return [
        { type: "error", content: `  Command not found: "${input}"` },
        { type: "output", content: '  Type "help" to see available commands.' },
        { type: "blank", content: "" },
      ];
  }
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const [history, setHistory] = useState<OutputLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = () => {
    if (!input.trim() && input !== "") {
      setHistory((h) => [...h, { type: "blank", content: "" }]);
      setInput("");
      return;
    }

    const cmd = input.trim();
    const output = processCommand(cmd);

    if (output[0]?.content === "__CLEAR__") {
      setHistory(WELCOME_LINES);
    } else {
      setHistory((h) => [
        ...h,
        { type: "command", content: cmd },
        ...output,
      ]);
    }

    if (cmd) {
      setCmdHistory((prev) => [cmd, ...prev]);
    }
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(newIdx);
      setInput(cmdHistory[newIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[newIdx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const lineColor: Record<string, string> = {
    command: "text-green-400",
    output: "text-gray-300",
    error: "text-red-400",
    success: "text-cyan-400",
    info: "text-purple-300",
    blank: "",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
            style={{ background: "rgba(5, 5, 20, 0.97)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-black/30">
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-500 font-mono">
                kamakshi@portfolio:~$ — terminal
              </div>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-400 text-xs font-mono"
              >
                [esc]
              </button>
            </div>

            {/* Terminal Body */}
            <div
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#6366f1 #0a0a1a" }}
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, i) => (
                <div key={i} className={`leading-5 ${lineColor[line.type] || ""}`}>
                  {line.type === "command" ? (
                    <span>
                      <span className="text-indigo-400">kamakshi</span>
                      <span className="text-gray-600">@portfolio</span>
                      <span className="text-gray-600">:~$ </span>
                      <span className="text-green-300">{line.content as string}</span>
                    </span>
                  ) : line.type === "blank" ? (
                    <br />
                  ) : (
                    <span>{line.content as string}</span>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Line */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-black/20">
              <span className="text-indigo-400 font-mono text-sm shrink-0">kamakshi</span>
              <span className="text-gray-600 font-mono text-sm">@portfolio:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-300 font-mono text-sm focus:outline-none caret-indigo-400"
                autoComplete="off"
                spellCheck={false}
                placeholder=""
                autoCapitalize="none"
              />
              <span className="text-indigo-400 font-mono animate-blink">█</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
