import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons", "@tabler/icons-react"],
  },
};

export default nextConfig;
