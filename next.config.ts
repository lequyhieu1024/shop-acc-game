import { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["blush-secure-parrot-598.mypinata.cloud"],
    },
    webpack: (config) => {
        config.module.exprContextCritical = false;
        return config;
    }
};

export default nextConfig;
