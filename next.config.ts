import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons", "@tabler/icons-react"],
  },
};

export default nextConfig;
