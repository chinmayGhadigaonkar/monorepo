import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // basePath must be a single string (path prefix), for example: "/app"
    // If you intended to use globs for TypeScript files, that belongs in tsconfig or other tooling config.
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: "/**",
            },
        ],
    },

    serverExternalPackages: ["bullmq"],

    devIndicators: false,

    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
};

export default nextConfig;

//  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
