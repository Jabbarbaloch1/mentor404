import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    // Don't block production builds on lint warnings — run `npm run lint` separately.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
