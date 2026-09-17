import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foodblog-pi.vercel.app",
        port: "",
        pathname: "/publication-media/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
