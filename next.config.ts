import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["blush-secure-parrot-598.mypinata.cloud"]
  },
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
  optimizeFonts: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  trailingSlash: false
};

export default nextConfig;
