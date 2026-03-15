import { NextResponse } from "next/server";
import fallbackStats from "@/data/codingStats.json";
import projectsData from "@/data/projects.json";
import certificatesData from "@/data/certificates.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HeatmapDay = {
  date: string;
  count: number;
  level: number;
};

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

type LeetCodeBreakdown = {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  totalLabel: string;
  totalValue: number;
};

type PlatformLink = {
  id: string;
  name: string;
  icon: string;
  username: string;
  keyMetric: string;
  url: string;
};

type PersonalDevelopment = {
  yearsExperience: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  totalCertifications: number;
  totalSkills: number;
  avgSkillsPerProject: number;
  mostUsedTech: string;
};

type SkillUsageGroup = {
  category: string;
  skills: Array<{ name: string; count: number }>;
};

type ApiErrors = {
  leetcode: string | null;
  github: string | null;
  hackerrank: string | null;
  gfg: string | null;
};

type ApiPayload = {
  platforms: PlatformCard[];
  leetcodeBreakdown: LeetCodeBreakdown;
  heatmap: {
    title: string;
    maxCount: number;
    days: HeatmapDay[];
  };
  platformLinks: PlatformLink[];
  personalDevelopment: PersonalDevelopment;
  skillUsage: SkillUsageGroup[];
  errors: ApiErrors;
};

type CacheShape = {
  at: number;
  data: ApiPayload;
};

declare global {
  var __codingStatsCacheV2: CacheShape | undefined;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

const PROFILES = {
  leetcode: {
    username: fallbackStats.leetcode.username,
    profileUrl: fallbackStats.leetcode.profileUrl,
  },
  github: {
    username: fallbackStats.github.username,
    profileUrl: fallbackStats.github.profileUrl,
  },
  hackerrank: {
    username: fallbackStats.hackerrank.username,
    profileUrl: fallbackStats.hackerrank.profileUrl,
  },
  gfg: {
    username: fallbackStats.gfg.username,
    profileUrl: fallbackStats.gfg.profileUrl,
  },
};

function parseNumber(input: string | undefined): number {
  if (!input) return 0;
  const normalized = input.replace(/,/g, "").trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

function findFirstNumber(text: string, patterns: RegExp[]): number {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const n = parseNumber(match[1]);
      if (n > 0) return n;
    }
  }
  return 0;
}

async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  const githubToken = process.env.GITHUB_TOKEN;
  const headers = new Headers(init?.headers || {});
  headers.set("User-Agent", "portfolio-stats-bot");
  headers.set("Accept", "application/json, text/plain, */*");
  if (url.includes("api.github.com") && githubToken) {
    headers.set("Authorization", `Bearer ${githubToken}`);
  }

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers,
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, init?: RequestInit): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": "portfolio-stats-bot",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function getHeatLevel(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) return 0;
  const ratio = count / maxCount;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

function buildFallbackHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 364);

  const baseSeed = 17;
  let maxCount = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const weekday = date.getDay();

    const raw = Math.abs(Math.sin((i + baseSeed) * 0.22) * 7 + Math.cos((i + baseSeed) * 0.11) * 4);
    const weekendPenalty = weekday === 0 || weekday === 6 ? 0.6 : 1;
    const count = Math.max(0, Math.round(raw * weekendPenalty));
    if (count > maxCount) maxCount = count;

    days.push({
      date: date.toISOString().slice(0, 10),
      count,
      level: 0,
    });
  }

  return days.map((d) => ({ ...d, level: getHeatLevel(d.count, maxCount) }));
}

async function getLeetCodeStats() {
  const query = `
    query userDashboard($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
      }
      userContestRanking(username: $username) {
        rating
      }
      matchedUser(username: $username) {
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
  `;

  const data = await fetchJson("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { username: PROFILES.leetcode.username },
    }),
  });

  const ac = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum ?? [];
  const statMap: Record<string, { count: number; submissions: number }> = {};
  for (const row of ac) {
    statMap[row.difficulty] = {
      count: Number(row?.count || 0),
      submissions: Number(row?.submissions || 0),
    };
  }

  const easy = statMap.Easy?.count || 0;
  const medium = statMap.Medium?.count || 0;
  const hard = statMap.Hard?.count || 0;
  const solved = statMap.All?.count || easy + medium + hard;

  const submissions = statMap.All?.submissions || easy + medium + hard;
  const acceptanceRate = submissions > 0 ? Math.round((solved / submissions) * 100) : 0;

  let heatmapDays = buildFallbackHeatmap();
  let activeDays = fallbackStats.leetcode.activeDays;
  let longestStreak = fallbackStats.leetcode.longestStreak;
  let currentStreak = fallbackStats.leetcode.currentStreak;

  const calendar = data?.data?.matchedUser?.userCalendar;
  if (calendar?.submissionCalendar) {
    try {
      const parsed = JSON.parse(calendar.submissionCalendar) as Record<string, number>;
      const dates = Object.keys(parsed).sort((a, b) => Number(a) - Number(b));
      const nowTs = Math.floor(Date.now() / 1000);
      const oneYearAgo = nowTs - 364 * 24 * 60 * 60;

      const days: HeatmapDay[] = [];
      let maxCount = 0;

      for (let ts = oneYearAgo; ts <= nowTs; ts += 24 * 60 * 60) {
        const count = Number(parsed[String(ts)] || 0);
        if (count > maxCount) maxCount = count;
        const date = new Date(ts * 1000).toISOString().slice(0, 10);
        days.push({ date, count, level: 0 });
      }

      heatmapDays = days.map((d) => ({ ...d, level: getHeatLevel(d.count, maxCount) }));
      activeDays = heatmapDays.filter((d) => d.count > 0).length;

      // Compute current and longest streak from calendar day activity.
      let running = 0;
      let longest = 0;
      for (const day of heatmapDays) {
        if (day.count > 0) {
          running += 1;
          if (running > longest) longest = running;
        } else {
          running = 0;
        }
      }

      let current = 0;
      for (let i = heatmapDays.length - 1; i >= 0; i--) {
        if (heatmapDays[i].count > 0) current += 1;
        else break;
      }

      currentStreak = current || Number(calendar.streak || 0) || fallbackStats.leetcode.currentStreak;
      longestStreak = longest || fallbackStats.leetcode.longestStreak;

      if (dates.length === 0) {
        activeDays = fallbackStats.leetcode.activeDays;
        currentStreak = fallbackStats.leetcode.currentStreak;
        longestStreak = fallbackStats.leetcode.longestStreak;
      }
    } catch {
      // Keep fallback heatmap.
    }
  }

  return {
    solved,
    easy,
    medium,
    hard,
    contestRating: Math.round(Number(data?.data?.userContestRanking?.rating || fallbackStats.leetcode.contestRating)),
    globalRank: Number(data?.data?.matchedUser?.profile?.ranking || fallbackStats.leetcode.globalRank),
    acceptanceRate,
    submissions,
    currentStreak,
    longestStreak,
    activeDays,
    heatmapDays,
  };
}

async function getGitHubStats() {
  const username = PROFILES.github.username;
  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const profileHtmlUrl = `https://github.com/${username}`;

  const [user, repos, profileHtml, prRes, issuesRes] = await Promise.all([
    fetchJson(userUrl),
    fetchJson(reposUrl),
    fetchText(profileHtmlUrl),
    fetchJson(`https://api.github.com/search/issues?q=author:${username}+type:pr`).catch(() => ({ total_count: 0 })),
    fetchJson(`https://api.github.com/search/issues?q=author:${username}+type:issue`).catch(() => ({ total_count: 0 })),
  ]);

  const repoCount = Number(user?.public_repos || 0);
  const followers = Number(user?.followers || 0);
  const following = Number(user?.following || 0);

  let stars = 0;
  const languageCount: Record<string, number> = {};
  if (Array.isArray(repos)) {
    for (const repo of repos) {
      stars += Number(repo?.stargazers_count || 0);
      if (repo?.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    }
  }

  const contributions = findFirstNumber(profileHtml, [
    /([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i,
  ]);

  const sortedLangs = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const topLanguage = sortedLangs[0]?.name || fallbackStats.github.topLanguage;

  return {
    repos: repoCount,
    publicRepos: repoCount,
    contributions: contributions || fallbackStats.github.contributions,
    stars,
    commits: contributions || fallbackStats.github.commits,
    pullRequests: Number(prRes?.total_count || fallbackStats.github.pullRequests),
    issues: Number(issuesRes?.total_count || fallbackStats.github.issues),
    followers,
    following,
    topLanguage,
    languages: sortedLangs.length > 0 ? sortedLangs : fallbackStats.github.languages.map((name) => ({ name, count: 1 })),
  };
}

async function getHackerRankStats() {
  const username = PROFILES.hackerrank.username;
  const profileUrl = PROFILES.hackerrank.profileUrl;

  const [badgesData, certData, profileHtml] = await Promise.all([
    fetchJson(`https://www.hackerrank.com/rest/hackers/${username}/badges`).catch(() => ({ models: [] })),
    fetchJson(`https://www.hackerrank.com/rest/hackers/${username}/certificates`).catch(() => ({ models: [] })),
    fetchText(profileUrl).catch(() => ""),
  ]);

  const badges = Array.isArray(badgesData?.models) ? badgesData.models.length : fallbackStats.hackerrank.badges;
  const certifications = Array.isArray(certData?.models) ? certData.models.length : fallbackStats.hackerrank.certifications;

  let stars = 0;
  if (Array.isArray(badgesData?.models)) {
    stars = badgesData.models.reduce((maxStar: number, badge: any) => Math.max(maxStar, Number(badge?.stars || 0)), 0);
  }

  if (!stars) {
    stars = findFirstNumber(profileHtml, [/([\d,]+)\s*stars/i]);
  }

  const algorithmsScore = findFirstNumber(profileHtml, [
    /Algorithms[^\d]{0,30}([\d,]{1,3})/i,
    /Algorithm[^\d]{0,30}([\d,]{1,3})/i,
  ]);
  const dataStructuresScore = findFirstNumber(profileHtml, [
    /Data\s*Structures[^\d]{0,30}([\d,]{1,3})/i,
  ]);
  const problemSolvingScore = findFirstNumber(profileHtml, [
    /Problem\s*Solving[^\d]{0,30}([\d,]{1,3})/i,
  ]);

  return {
    badges,
    stars: stars || fallbackStats.hackerrank.stars,
    certifications,
    algorithmsScore: algorithmsScore || fallbackStats.hackerrank.algorithmsScore,
    dataStructuresScore: dataStructuresScore || fallbackStats.hackerrank.dataStructuresScore,
    problemSolvingScore: problemSolvingScore || fallbackStats.hackerrank.problemSolvingScore,
  };
}

async function getGfgStats() {
  const html = await fetchText(PROFILES.gfg.profileUrl);

  const solved = findFirstNumber(html, [
    /Problems\s*Solved[\s\S]{0,120}?([\d,]+)/i,
    /"problemSolved"\s*:\s*"?([\d,]+)"?/i,
  ]);

  const score = findFirstNumber(html, [
    /Coding\s*Score[\s\S]{0,120}?([\d,]+)/i,
    /"coding_score"\s*:\s*"?([\d,]+)"?/i,
  ]);

  const articlesRead = findFirstNumber(html, [
    /Articles\s*Read[^\d]{0,50}([\d,]+)/i,
    /articlesRead\"?\s*:\s*\"?([\d,]+)\"?/i,
  ]);

  const practiceStreak = findFirstNumber(html, [
    /Streak[^\d]{0,30}([\d,]+)/i,
    /practiceStreak\"?\s*:\s*\"?([\d,]+)\"?/i,
  ]);

  const monthlyRankingPercent =
    findFirstNumber(html, [/Top\s*([\d,]+)\s*%/i, /monthly\s*ranking[^\d]{0,20}([\d,]+)/i]) ||
    parseNumber(String(fallbackStats.gfg.monthlyRanking).replace(/[^\d]/g, ""));

  const scorePerProblem = solved > 0 ? Math.round(score / solved) : fallbackStats.gfg.scorePerProblem;

  return {
    solved: solved || fallbackStats.gfg.solved,
    score: score || fallbackStats.gfg.score,
    scorePerProblem,
    monthlyRankingPercent: monthlyRankingPercent || 10,
    articlesRead: articlesRead || fallbackStats.gfg.articlesRead,
    practiceStreak: practiceStreak || fallbackStats.gfg.practiceStreak,
  };
}

function deriveSkillUsageFromProjects() {
  const counter: Record<string, number> = {};

  for (const project of projectsData.projects) {
    for (const tech of project.tech) {
      const key = tech.trim();
      if (!key) continue;
      counter[key] = (counter[key] || 0) + 1;
    }
  }

  const normalized = (name: string) => name.toLowerCase().replace(/\s|\.|\-/g, "");

  const front = ["nextjs", "react", "tailwindcss", "typescript", "javascript", "html", "css"];
  const back = ["nodejs", "express", "nginx", "php"];
  const db = ["mongodb", "postgresql", "mysql"];
  const other = ["websockets", "jwt", "docker", "aws", "grokaiapi", "dsa"];

  const pickGroup = (matches: string[]) =>
    Object.entries(counter)
      .filter(([name]) => matches.includes(normalized(name)))
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

  return [
    { category: "Frontend", skills: pickGroup(front) },
    { category: "Backend", skills: pickGroup(back) },
    { category: "Database", skills: pickGroup(db) },
    { category: "Other", skills: pickGroup(other) },
  ] as SkillUsageGroup[];
}

function mergeSkillUsageWithFallback(derived: SkillUsageGroup[]): SkillUsageGroup[] {
  const fallbackGroups = Object.entries(fallbackStats.skillUsage).map(([category, skills]) => ({ category, skills }));

  return fallbackGroups.map((fallbackGroup) => {
    const derivedGroup = derived.find((g) => g.category === fallbackGroup.category);
    if (!derivedGroup || derivedGroup.skills.length === 0) return fallbackGroup;

    const mergedMap = new Map<string, number>();

    for (const skill of fallbackGroup.skills) {
      mergedMap.set(skill.name, skill.count);
    }

    for (const skill of derivedGroup.skills) {
      mergedMap.set(skill.name, Math.max(skill.count, mergedMap.get(skill.name) || 0));
    }

    return {
      category: fallbackGroup.category,
      skills: Array.from(mergedMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };
  });
}

function buildPayload(input: {
  leetcode: Awaited<ReturnType<typeof getLeetCodeStats>>;
  github: Awaited<ReturnType<typeof getGitHubStats>>;
  hackerrank: Awaited<ReturnType<typeof getHackerRankStats>>;
  gfg: Awaited<ReturnType<typeof getGfgStats>>;
  errors: ApiErrors;
}): ApiPayload {
  const maxLeet = Math.max(input.leetcode.easy, input.leetcode.medium, input.leetcode.hard, 1);
  const maxHrScore = Math.max(
    input.hackerrank.algorithmsScore,
    input.hackerrank.dataStructuresScore,
    input.hackerrank.problemSolvingScore,
    100
  );
  const maxGfgMetric = Math.max(input.gfg.score, input.gfg.solved, 1);

  const platforms: PlatformCard[] = [
    {
      id: "leetcode",
      name: "LeetCode",
      icon: "leetcode",
      color: "#FFA116",
      gradient: "from-amber-500/10 to-transparent border-amber-500/20",
      username: PROFILES.leetcode.username,
      url: PROFILES.leetcode.profileUrl,
      primary: {
        label: "Problems Solved",
        value: input.leetcode.solved,
        suffix: "+",
      },
      keyMetric: `#${input.leetcode.globalRank}`,
      progressMetrics: [
        { label: "Easy Problems", value: input.leetcode.easy, max: maxLeet, solvedLabel: `${input.leetcode.easy} solved` },
        { label: "Medium Problems", value: input.leetcode.medium, max: maxLeet, solvedLabel: `${input.leetcode.medium} solved` },
        { label: "Hard Problems", value: input.leetcode.hard, max: maxLeet, solvedLabel: `${input.leetcode.hard} solved` },
      ],
      metrics: [
        { label: "Contest Rating", value: input.leetcode.contestRating },
        { label: "Global Rank", value: input.leetcode.globalRank, prefix: "#" },
        { label: "Acceptance Rate", value: input.leetcode.acceptanceRate, suffix: "%" },
        { label: "Total Submissions", value: input.leetcode.submissions },
      ],
      bottomStats: [
        { label: "Current Streak", value: input.leetcode.currentStreak },
        { label: "Longest Streak", value: input.leetcode.longestStreak },
        { label: "Active Days", value: input.leetcode.activeDays },
      ],
    },
    {
      id: "github",
      name: "GitHub",
      icon: "github",
      color: "#7C3AED",
      gradient: "from-purple-500/10 to-transparent border-purple-500/20",
      username: PROFILES.github.username,
      url: PROFILES.github.profileUrl,
      primary: {
        label: "Repositories",
        value: input.github.repos,
      },
      keyMetric: `${input.github.contributions}+ contributions`,
      progressMetrics: [
        {
          label: "Commits",
          value: input.github.commits,
          max: Math.max(input.github.commits, input.github.pullRequests, input.github.issues, 1),
          solvedLabel: `${input.github.commits}`,
        },
        {
          label: "Pull Requests",
          value: input.github.pullRequests,
          max: Math.max(input.github.commits, input.github.pullRequests, input.github.issues, 1),
          solvedLabel: `${input.github.pullRequests}`,
        },
        {
          label: "Issues Opened",
          value: input.github.issues,
          max: Math.max(input.github.commits, input.github.pullRequests, input.github.issues, 1),
          solvedLabel: `${input.github.issues}`,
        },
      ],
      metrics: [
        { label: "Public Repositories", value: input.github.publicRepos },
        { label: "Total Commits", value: input.github.commits },
        { label: "Pull Requests", value: input.github.pullRequests },
        { label: "Issues Opened", value: input.github.issues },
        { label: "Followers", value: input.github.followers },
        { label: "Following", value: input.github.following },
      ],
      badges: input.github.languages.map((language) => ({
        name: language.name,
        count: language.count,
      })),
    },
    {
      id: "hackerrank",
      name: "HackerRank",
      icon: "hackerrank",
      color: "#00EA64",
      gradient: "from-green-500/10 to-transparent border-green-500/20",
      username: PROFILES.hackerrank.username,
      url: PROFILES.hackerrank.profileUrl,
      primary: {
        label: "Badges Earned",
        value: input.hackerrank.badges,
      },
      keyMetric: `${input.hackerrank.stars}★ rating`,
      progressMetrics: [
        { label: "Algorithms Score", value: input.hackerrank.algorithmsScore, max: maxHrScore, solvedLabel: `${input.hackerrank.algorithmsScore}%` },
        { label: "Data Structures Score", value: input.hackerrank.dataStructuresScore, max: maxHrScore, solvedLabel: `${input.hackerrank.dataStructuresScore}%` },
        { label: "Problem Solving Score", value: input.hackerrank.problemSolvingScore, max: maxHrScore, solvedLabel: `${input.hackerrank.problemSolvingScore}%` },
      ],
      metrics: [
        { label: "Badges Earned", value: input.hackerrank.badges },
        { label: "Star Rating", value: input.hackerrank.stars },
        { label: "Certifications", value: input.hackerrank.certifications },
      ],
    },
    {
      id: "gfg",
      name: "GeeksForGeeks",
      icon: "gfg",
      color: "#2F8D46",
      gradient: "from-emerald-500/10 to-transparent border-emerald-500/20",
      username: PROFILES.gfg.username,
      url: PROFILES.gfg.profileUrl,
      primary: {
        label: "Problems Solved",
        value: input.gfg.solved,
        suffix: "+",
      },
      keyMetric: `${input.gfg.score} score`,
      progressMetrics: [
        { label: "Problems Solved", value: input.gfg.solved, max: maxGfgMetric, solvedLabel: `${input.gfg.solved}+` },
        { label: "Coding Score", value: input.gfg.score, max: maxGfgMetric, solvedLabel: `${input.gfg.score}` },
        { label: "Practice Streak", value: input.gfg.practiceStreak, max: 30, solvedLabel: `${input.gfg.practiceStreak} days` },
      ],
      metrics: [
        { label: "Coding Score", value: input.gfg.score },
        { label: "Score / Problem", value: input.gfg.scorePerProblem },
      ],
      bottomStats: [
        { label: "Monthly Ranking", value: input.gfg.monthlyRankingPercent, suffix: "%" },
        { label: "Articles Read", value: input.gfg.articlesRead },
        { label: "Practice Streak", value: input.gfg.practiceStreak, suffix: "d" },
      ],
    },
  ];

  const leetcodeBreakdown: LeetCodeBreakdown = {
    title: "LeetCode Difficulty Breakdown",
    data: [
      { name: "Easy", value: input.leetcode.easy, color: "#10B981" },
      { name: "Medium", value: input.leetcode.medium, color: "#F59E0B" },
      { name: "Hard", value: input.leetcode.hard, color: "#EF4444" },
    ],
    totalLabel: "Total solved",
    totalValue: input.leetcode.solved,
  };

  const heatmapMax = input.leetcode.heatmapDays.reduce((max, day) => Math.max(max, day.count), 0);

  const platformLinks: PlatformLink[] = platforms.map((p) => ({
    id: p.id,
    name: p.name,
    icon: p.id,
    username: p.username,
    keyMetric: p.keyMetric,
    url: p.url,
  }));

  const derivedSkillUsage = mergeSkillUsageWithFallback(deriveSkillUsageFromProjects());
  const derivedSkillCount = derivedSkillUsage.reduce((acc, group) => acc + group.skills.length, 0);

  const personalDevelopment: PersonalDevelopment = {
    yearsExperience: fallbackStats.personalDevelopment.yearsExperience,
    totalProjects: Math.max(fallbackStats.personalDevelopment.totalProjects, projectsData.projects.length),
    completedProjects: Math.max(
      fallbackStats.personalDevelopment.completedProjects,
      projectsData.projects.filter((p) => p.demo && p.demo !== "#").length
    ),
    inProgressProjects: Math.max(
      fallbackStats.personalDevelopment.inProgressProjects,
      Math.max(0, projectsData.projects.length - projectsData.projects.filter((p) => p.demo && p.demo !== "#").length)
    ),
    totalCertifications: Math.max(fallbackStats.personalDevelopment.totalCertifications, certificatesData.certificates.length),
    totalSkills: Math.max(fallbackStats.personalDevelopment.totalSkills, derivedSkillCount),
    avgSkillsPerProject: fallbackStats.personalDevelopment.avgSkillsPerProject,
    mostUsedTech: fallbackStats.personalDevelopment.mostUsedTech,
  };

  return {
    platforms,
    leetcodeBreakdown,
    heatmap: {
      title: "Coding Activity Heatmap",
      maxCount: heatmapMax,
      days: input.leetcode.heatmapDays,
    },
    platformLinks,
    personalDevelopment,
    skillUsage: derivedSkillUsage,
    errors: input.errors,
  };
}

export async function GET() {
  const now = Date.now();
  const cached = globalThis.__codingStatsCacheV2;

  if (cached && now - cached.at < CACHE_TTL_MS) {
    return NextResponse.json({ ...cached.data, updatedAt: cached.at, cached: true });
  }

  const [leetcodeRes, githubRes, hackerrankRes, gfgRes] = await Promise.allSettled([
    getLeetCodeStats(),
    getGitHubStats(),
    getHackerRankStats(),
    getGfgStats(),
  ]);

  const leetcode =
    leetcodeRes.status === "fulfilled"
      ? leetcodeRes.value
      : {
          solved: fallbackStats.leetcode.solved,
          easy: fallbackStats.leetcode.easy,
          medium: fallbackStats.leetcode.medium,
          hard: fallbackStats.leetcode.hard,
          contestRating: fallbackStats.leetcode.contestRating,
          globalRank: fallbackStats.leetcode.globalRank,
          acceptanceRate: fallbackStats.leetcode.acceptanceRate,
          submissions: fallbackStats.leetcode.submissions,
          currentStreak: fallbackStats.leetcode.currentStreak,
          longestStreak: fallbackStats.leetcode.longestStreak,
          activeDays: fallbackStats.leetcode.activeDays,
          heatmapDays: buildFallbackHeatmap(),
        };

  const github =
    githubRes.status === "fulfilled"
      ? githubRes.value
      : {
          repos: fallbackStats.github.repos,
          publicRepos: fallbackStats.github.publicRepos,
          contributions: fallbackStats.github.contributions,
          stars: fallbackStats.github.stars,
          commits: fallbackStats.github.commits,
          pullRequests: fallbackStats.github.pullRequests,
          issues: fallbackStats.github.issues,
          followers: fallbackStats.github.followers,
          following: fallbackStats.github.following,
          topLanguage: fallbackStats.github.topLanguage,
          languages: fallbackStats.github.languages.map((name) => ({ name, count: 1 })),
        };

  const hackerrank =
    hackerrankRes.status === "fulfilled"
      ? hackerrankRes.value
      : {
          badges: fallbackStats.hackerrank.badges,
          stars: fallbackStats.hackerrank.stars,
          certifications: fallbackStats.hackerrank.certifications,
          algorithmsScore: fallbackStats.hackerrank.algorithmsScore,
          dataStructuresScore: fallbackStats.hackerrank.dataStructuresScore,
          problemSolvingScore: fallbackStats.hackerrank.problemSolvingScore,
        };

  const gfg =
    gfgRes.status === "fulfilled"
      ? gfgRes.value
      : {
          solved: fallbackStats.gfg.solved,
          score: fallbackStats.gfg.score,
          scorePerProblem: fallbackStats.gfg.scorePerProblem,
          monthlyRankingPercent: parseNumber(String(fallbackStats.gfg.monthlyRanking).replace(/[^\d]/g, "")) || 10,
          articlesRead: fallbackStats.gfg.articlesRead,
          practiceStreak: fallbackStats.gfg.practiceStreak,
        };

  const errors: ApiErrors = {
    leetcode: leetcodeRes.status === "rejected" ? String(leetcodeRes.reason) : null,
    github: githubRes.status === "rejected" ? String(githubRes.reason) : null,
    hackerrank: hackerrankRes.status === "rejected" ? String(hackerrankRes.reason) : null,
    gfg: gfgRes.status === "rejected" ? String(gfgRes.reason) : null,
  };

  const payload = buildPayload({ leetcode, github, hackerrank, gfg, errors });

  globalThis.__codingStatsCacheV2 = {
    at: now,
    data: payload,
  };

  return NextResponse.json({
    ...payload,
    updatedAt: now,
    cached: false,
  });
}
