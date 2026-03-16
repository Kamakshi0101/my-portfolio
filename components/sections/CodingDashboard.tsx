"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import statsData from "@/data/codingStats.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { SiLeetcode, SiGithub, SiHackerrank, SiGeeksforgeeks } from "react-icons/si";

type PlatformMetric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

type ProgressMetric = {
  label: string;
  value: number;
  max: number;
  solvedLabel?: string;
};

type BottomStat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

type BadgeMetric = {
  name: string;
  count: number;
  color?: string;
};

type PlatformCard = {
  id: "leetcode" | "github" | "hackerrank" | "gfg";
  name: string;
  icon: string;
  color: string;
  gradient: string;
  username: string;
  url: string;
  primary: {
    label: string;
    value: number;
    suffix?: string;
  };
  keyMetric: string;
  progressMetrics: ProgressMetric[];
  metrics: PlatformMetric[];
  bottomStats?: BottomStat[];
  badges?: BadgeMetric[];
};

type ApiPayload = {
  platforms: PlatformCard[];
  leetcodeBreakdown: {
    title: string;
    data: Array<{ name: string; value: number; color: string }>;
    totalLabel: string;
    totalValue: number;
  };
  heatmap: {
    title: string;
    maxCount: number;
    days: Array<{ date: string; count: number; level: number }>;
  };
  platformLinks: Array<{
    id: string;
    name: string;
    icon: string;
    username: string;
    keyMetric: string;
    url: string;
  }>;
  personalDevelopment: {
    yearsExperience: number;
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    totalCertifications: number;
    totalSkills: number;
    avgSkillsPerProject: number;
    mostUsedTech: string;
  };
  skillUsage: Array<{
    category: string;
    skills: Array<{ name: string; count: number }>;
  }>;
  errors?: {
    leetcode: string | null;
    github: string | null;
    hackerrank: string | null;
    gfg: string | null;
  };
};

function useCountUp(target: number, duration = 1800, start = false, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = eased * target;
      const fixed = decimals > 0 ? Number(next.toFixed(decimals)) : Math.floor(next);
      setCount(fixed);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start, decimals]);

  return count;
}

function PlatformLogo({ id }: { id: PlatformCard["id"] }) {
  const baseClass = "w-5 h-5 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105";

  if (id === "leetcode") {
    return <SiLeetcode className={baseClass} style={{ color: "#FFA116" }} />;
  }
  if (id === "github") {
    return <SiGithub className={baseClass} style={{ color: "#FFFFFF" }} />;
  }
  if (id === "hackerrank") {
    return <SiHackerrank className={baseClass} style={{ color: "#00EA64" }} />;
  }
  return <SiGeeksforgeeks className={baseClass} style={{ color: "#2F8D46" }} />;
}

function AnimatedMetricValue({
  value,
  prefix,
  suffix,
  start,
  className,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  start: boolean;
  className?: string;
  decimals?: number;
}) {
  const animated = useCountUp(value, 1800, start, decimals);
  return (
    <span className={className}>
      {prefix || ""}
      {animated}
      {suffix || ""}
    </span>
  );
}

function StatCard({ platform, delay, unavailable }: { platform: PlatformCard; delay: number; unavailable?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.a
      ref={ref}
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="block group"
    >
      <GlassCard className={`p-5 border bg-linear-to-br ${platform.gradient} h-full`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <PlatformLogo id={platform.id} />
            <div>
              <h3 className="font-bold text-white font-heading leading-5">{platform.name}</h3>
              <p className="text-xs text-gray-500">Platform stats</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse mt-1" style={{ backgroundColor: platform.color }} />
            <span className="text-[10px] text-gray-500 tracking-wide">Open Profile ↗</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500">{platform.primary.label}</div>
          <AnimatedMetricValue
            value={platform.primary.value}
            suffix={platform.primary.suffix}
            start={inView}
            className="text-2xl font-bold text-white font-mono"
          />
          <div className="text-xs text-gray-400 mt-0.5">
            {unavailable ? "Data temporarily unavailable" : platform.keyMetric}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {platform.progressMetrics.map((item) => {
            const width = item.max > 0 ? Math.min(100, (item.value / item.max) * 100) : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-gray-400">{item.solvedLabel || item.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: platform.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${width}%` } : { width: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          {platform.metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-white/10 p-2 bg-white/5">
              <div className="text-gray-500">{metric.label}</div>
              <AnimatedMetricValue
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                start={inView}
                className="text-sm font-semibold text-white"
              />
            </div>
          ))}
        </div>

        {platform.badges && platform.badges.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-cyan-300 mb-2">Language Usage</div>
            <div className="flex flex-wrap gap-1.5">
              {platform.badges.map((badge) => (
                <span
                  key={badge.name}
                  className="px-2 py-0.5 rounded-full text-xs border border-white/10 bg-white/5 text-gray-200"
                >
                  {badge.name} ({badge.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {platform.bottomStats && platform.bottomStats.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-white/10">
            {platform.bottomStats.map((item) => (
              <div key={item.label} className="text-center">
                <AnimatedMetricValue
                  value={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  start={inView}
                  className="text-lg font-bold text-white"
                />
                <div className="text-[11px] text-gray-500 leading-4">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.a>
  );
}

function buildFallbackPayload(): ApiPayload {
  const maxLeet = Math.max(statsData.leetcode.easy, statsData.leetcode.medium, statsData.leetcode.hard, 1);

  return {
    platforms: [
      {
        id: "leetcode",
        name: "LeetCode",
        icon: "⚡",
        color: "#FFA116",
        gradient: "from-amber-500/10 to-transparent border-amber-500/20",
        username: statsData.leetcode.username,
        url: statsData.leetcode.profileUrl,
        primary: { label: "Problems Solved", value: statsData.leetcode.solved, suffix: "+" },
        keyMetric: `#${statsData.leetcode.globalRank}`,
        progressMetrics: [
          { label: "Easy Problems", value: statsData.leetcode.easy, max: maxLeet, solvedLabel: `${statsData.leetcode.easy} solved` },
          { label: "Medium Problems", value: statsData.leetcode.medium, max: maxLeet, solvedLabel: `${statsData.leetcode.medium} solved` },
          { label: "Hard Problems", value: statsData.leetcode.hard, max: maxLeet, solvedLabel: `${statsData.leetcode.hard} solved` },
        ],
        metrics: [
          { label: "Contest Rating", value: statsData.leetcode.contestRating },
          { label: "Global Rank", value: statsData.leetcode.globalRank, prefix: "#" },
          { label: "Acceptance Rate", value: statsData.leetcode.acceptanceRate, suffix: "%" },
          { label: "Total Submissions", value: statsData.leetcode.submissions },
        ],
        bottomStats: [
          { label: "Current Streak", value: statsData.leetcode.currentStreak },
          { label: "Longest Streak", value: statsData.leetcode.longestStreak },
          { label: "Active Days", value: statsData.leetcode.activeDays },
        ],
      },
      {
        id: "github",
        name: "GitHub",
        icon: "🐙",
        color: "#7C3AED",
        gradient: "from-purple-500/10 to-transparent border-purple-500/20",
        username: statsData.github.username,
        url: statsData.github.profileUrl,
        primary: { label: "Repositories", value: statsData.github.repos },
        keyMetric: `${statsData.github.contributions}+ contributions`,
        progressMetrics: [
          { label: "Commits", value: statsData.github.commits, max: statsData.github.commits, solvedLabel: `${statsData.github.commits}` },
          { label: "Pull Requests", value: statsData.github.pullRequests, max: statsData.github.commits, solvedLabel: `${statsData.github.pullRequests}` },
          { label: "Issues Opened", value: statsData.github.issues, max: statsData.github.commits, solvedLabel: `${statsData.github.issues}` },
        ],
        metrics: [
          { label: "Public Repositories", value: statsData.github.publicRepos },
          { label: "Total Commits", value: statsData.github.commits },
          { label: "Pull Requests", value: statsData.github.pullRequests },
          { label: "Issues Opened", value: statsData.github.issues },
          { label: "Followers", value: statsData.github.followers },
          { label: "Following", value: statsData.github.following },
        ],
        badges: statsData.github.languages.map((name) => ({ name, count: 1 })),
      },
      {
        id: "hackerrank",
        name: "HackerRank",
        icon: "🏆",
        color: "#00EA64",
        gradient: "from-green-500/10 to-transparent border-green-500/20",
        username: statsData.hackerrank.username,
        url: statsData.hackerrank.profileUrl,
        primary: { label: "Badges Earned", value: statsData.hackerrank.badges },
        keyMetric: `${statsData.hackerrank.stars}★ rating`,
        progressMetrics: [
          { label: "Algorithms Score", value: statsData.hackerrank.algorithmsScore, max: 100, solvedLabel: `${statsData.hackerrank.algorithmsScore}%` },
          { label: "Data Structures Score", value: statsData.hackerrank.dataStructuresScore, max: 100, solvedLabel: `${statsData.hackerrank.dataStructuresScore}%` },
          { label: "Problem Solving Score", value: statsData.hackerrank.problemSolvingScore, max: 100, solvedLabel: `${statsData.hackerrank.problemSolvingScore}%` },
        ],
        metrics: [
          { label: "Badges Earned", value: statsData.hackerrank.badges },
          { label: "Star Rating", value: statsData.hackerrank.stars },
          { label: "Certifications", value: statsData.hackerrank.certifications },
        ],
      },
      {
        id: "gfg",
        name: "GeeksForGeeks",
        icon: "🌿",
        color: "#2F8D46",
        gradient: "from-emerald-500/10 to-transparent border-emerald-500/20",
        username: statsData.gfg.username,
        url: statsData.gfg.profileUrl,
        primary: { label: "Problems Solved", value: statsData.gfg.solved, suffix: "+" },
        keyMetric: `${statsData.gfg.score} score`,
        progressMetrics: [
          { label: "Problems Solved", value: statsData.gfg.solved, max: statsData.gfg.score, solvedLabel: `${statsData.gfg.solved}+` },
          { label: "Coding Score", value: statsData.gfg.score, max: statsData.gfg.score, solvedLabel: `${statsData.gfg.score}` },
          { label: "Practice Streak", value: statsData.gfg.practiceStreak, max: 30, solvedLabel: `${statsData.gfg.practiceStreak} days` },
        ],
        metrics: [
          { label: "Coding Score", value: statsData.gfg.score },
          { label: "Score / Problem", value: statsData.gfg.scorePerProblem },
        ],
        bottomStats: [
          { label: "Monthly Ranking", value: 10, suffix: "%" },
          { label: "Articles Read", value: statsData.gfg.articlesRead },
          { label: "Practice Streak", value: statsData.gfg.practiceStreak, suffix: "d" },
        ],
      },
    ],
    leetcodeBreakdown: {
      title: "LeetCode Difficulty Breakdown",
      data: [
        { name: "Easy", value: statsData.leetcode.easy, color: "#10B981" },
        { name: "Medium", value: statsData.leetcode.medium, color: "#F59E0B" },
        { name: "Hard", value: statsData.leetcode.hard, color: "#EF4444" },
      ],
      totalLabel: "Total solved",
      totalValue: statsData.leetcode.solved,
    },
    heatmap: {
      title: "Coding Activity Heatmap",
      maxCount: 0,
      days: [],
    },
    platformLinks: [
      {
        id: "leetcode",
        name: "LeetCode",
        icon: "⚡",
        username: statsData.leetcode.username,
        keyMetric: `${statsData.leetcode.solved}+ solved`,
        url: statsData.leetcode.profileUrl,
      },
      {
        id: "github",
        name: "GitHub",
        icon: "🐙",
        username: statsData.github.username,
        keyMetric: `${statsData.github.repos} repositories`,
        url: statsData.github.profileUrl,
      },
      {
        id: "hackerrank",
        name: "HackerRank",
        icon: "🏆",
        username: statsData.hackerrank.username,
        keyMetric: `${statsData.hackerrank.badges} badges`,
        url: statsData.hackerrank.profileUrl,
      },
      {
        id: "gfg",
        name: "GeeksForGeeks",
        icon: "🌿",
        username: statsData.gfg.username,
        keyMetric: `${statsData.gfg.solved}+ solved`,
        url: statsData.gfg.profileUrl,
      },
    ],
    personalDevelopment: statsData.personalDevelopment,
    skillUsage: Object.entries(statsData.skillUsage).map(([category, skills]) => ({ category, skills })),
  };
}

export default function CodingDashboard() {
  const [dashboardData, setDashboardData] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const res = await fetch("/api/coding-stats", { cache: "no-store" });
        if (!res.ok) {
          setDashboardData((prev) => prev || buildFallbackPayload());
          return;
        }
        const data = (await res.json()) as ApiPayload;
        if (!active) return;

        setDashboardData((prev) => ({
          ...(prev || buildFallbackPayload()),
          ...data,
          platforms: Array.isArray(data.platforms) && data.platforms.length > 0 ? data.platforms : (prev || buildFallbackPayload()).platforms,
          leetcodeBreakdown: data.leetcodeBreakdown || (prev || buildFallbackPayload()).leetcodeBreakdown,
          heatmap: data.heatmap || (prev || buildFallbackPayload()).heatmap,
          platformLinks: Array.isArray(data.platformLinks) && data.platformLinks.length > 0 ? data.platformLinks : (prev || buildFallbackPayload()).platformLinks,
          personalDevelopment: data.personalDevelopment || (prev || buildFallbackPayload()).personalDevelopment,
          skillUsage: Array.isArray(data.skillUsage) && data.skillUsage.length > 0 ? data.skillUsage : (prev || buildFallbackPayload()).skillUsage,
        }));
      } catch {
        setDashboardData((prev) => prev || buildFallbackPayload());
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 1000 * 60 * 30);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const data = dashboardData || buildFallbackPayload();

  return (
    <SectionWrapper id="stats" className="bg-dark-surface/20" variant="cinematic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-green-400 text-sm font-mono tracking-widest uppercase">{"// Activity"}</span>
          <h2 className="section-heading gradient-text mt-2">Coding Dashboard</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
            Live coding statistics and analytics across competitive programming and development platforms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {loading && !dashboardData
            ? Array.from({ length: 4 }).map((_, i) => (
                <GlassCard key={`skeleton-${i}`} className="p-5 border border-white/10 h-full" hover={false}>
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-24 rounded bg-white/10" />
                    <div className="h-7 w-28 rounded bg-white/10" />
                    <div className="h-2 w-full rounded bg-white/10" />
                    <div className="h-2 w-5/6 rounded bg-white/10" />
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="h-10 rounded bg-white/10" />
                      <div className="h-10 rounded bg-white/10" />
                    </div>
                  </div>
                </GlassCard>
              ))
            : data.platforms.map((platform, index) => (
                <StatCard
                  key={platform.id}
                  platform={platform}
                  delay={index * 0.12}
                  unavailable={Boolean(data.errors?.[platform.id])}
                />
              ))}
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-6 border border-cyan-500/20 bg-linear-to-br from-cyan-500/5 to-transparent h-full">
              <h3 className="font-bold text-white font-heading mb-4">My Development Stats</h3>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Total Projects", value: data.personalDevelopment.totalProjects, suffix: "" },
                  { label: "Completed Projects", value: data.personalDevelopment.completedProjects, suffix: "" },
                  { label: "In Progress", value: data.personalDevelopment.inProgressProjects, suffix: "" },
                  { label: "Certifications", value: data.personalDevelopment.totalCertifications, suffix: "" },
                  { label: "Total Skills", value: data.personalDevelopment.totalSkills, suffix: "" },
                  { label: "Avg Skills / Project", value: data.personalDevelopment.avgSkillsPerProject, decimals: 1, suffix: "" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] text-gray-500">{item.label}</div>
                    <AnimatedMetricValue
                      value={item.value}
                      suffix={item.suffix}
                      decimals={item.decimals || 0}
                      start
                      className="text-base font-semibold text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm font-semibold text-cyan-300 mb-2">Skill Usage</div>
                <div className="space-y-2">
                  {data.skillUsage.map((group) => (
                    <div key={group.category}>
                      <div className="text-xs text-gray-400 mb-1">{group.category}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <span
                            key={`${group.category}-${skill.name}`}
                            className="px-2 py-0.5 rounded-full text-xs border border-white/10 bg-white/5 text-gray-200"
                          >
                            {skill.name} ({skill.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
