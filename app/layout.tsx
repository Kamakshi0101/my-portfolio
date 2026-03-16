import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamakshi Aggarwal – Software Engineer & Full Stack Developer",
  description:
    "Portfolio of Kamakshi Aggarwal – Software Engineer specializing in Backend Development, Competitive Programming, and AI Systems. BTech CSE student at Lovely Professional University.",
  keywords: [
    "Kamakshi Aggarwal",
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "React",
    "Next.js",
    "Node.js",
    "Portfolio",
    "LPU",
    "Competitive Programmer",
  ],
  authors: [{ name: "Kamakshi Aggarwal" }],
  creator: "Kamakshi Aggarwal",
  openGraph: {
    type: "website",
    title: "Kamakshi Aggarwal – Software Engineer",
    description:
      "Premium developer portfolio showcasing projects, skills, achievements, and coding statistics.",
    siteName: "Kamakshi Aggarwal Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamakshi Aggarwal – Software Engineer",
    description: "Premium developer portfolio with interactive terminal, 3D project lab, and coding dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/avatar.jpg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased dark">{children}</body>
    </html>
  );
}
