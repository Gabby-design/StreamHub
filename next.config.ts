import type { NextConfig } from "next";

const cspFrameDomains = [
  "'self'",
  "https://*.vidlink.pro",
  "https://vidlink.pro",
  "https://*.vidzee.wtf",
  "https://player.vidzee.wtf",
  "https://vidzee.wtf",
  "https://*.vidfast.pro",
  "https://vidfast.pro",
  "https://*.vidfast.vc",
  "https://vidfast.vc",
  "https://*.vidrock.to",
  "https://vidrock.to",
  "https://*.viduki.net",
  "https://www.viduki.net",
  "https://api.viduki.net",
  "https://viduki.net",
  "https://*.vidy.st",
  "https://www.vidy.st",
  "https://vidy.st",
  "https://*.autoembed.co",
  "https://autoembed.co",
  "https://*.player.autoembed.co",
  "https://player.autoembed.co",
  "https://*.vidsrc.to",
  "https://vidsrc.to",
  "https://*.vidsrc.me",
  "https://vidsrc.me",
  "https://*.vidsrc.sh",
  "https://vidsrc.sh",
  "https://*.vidsrc.cc",
  "https://vidsrc.cc",
  "https://*.embed.su",
  "https://embed.su",
  "https://*.multiembed.mov",
  "https://multiembed.mov",
  "https://*.streamingnow.mov",
  "https://streamingnow.mov",
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
