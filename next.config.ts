import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["blush-secure-parrot-598.mypinata.cloud"]
  },

  webpack: (config) => {
    // Use type assertion to avoid TypeScript errors
    const typedConfig = config as any;
    typedConfig.module.exprContextCritical = false;
    return typedConfig;
  },

  optimizeFonts: true,
  swcMinify: true,

  compiler: {
    styledComponents: true
  },

  // Simplified experimental section to avoid errors
  experimental: {},

  reactStrictMode: true
};

export default nextConfig;
