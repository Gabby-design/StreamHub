import type { NextConfig } from "next";

const cspFrameDomains = [
  "'self'",
  "https://*.vidlink.pro",
  "https://vidlink.pro",
  "https://*.autoembed.co",
  "https://autoembed.co",
  "https://*.vidsrc.cc",
  "https://vidsrc.cc",
  "https://*.embed.su",
  "https://embed.su",
  "https://*.multiembed.mov",
  "https://multiembed.mov",
  "https://*.vidfast.pro",
  "https://vidfast.pro",
  "https://*.vidsrc.me",
  "https://vidsrc.me",
  "https://*.vidsrc.to",
  "https://vidsrc.to",
  "https://*.2embed.cc",
  "https://2embed.cc",
  "https://*.youtube-nocookie.com",
  "https://www.youtube-nocookie.com",
  "https://*.youtube.com",
  "https://www.youtube.com",
].join(" ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-src ${cspFrameDomains};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
