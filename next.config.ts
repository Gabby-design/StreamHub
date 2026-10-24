import type { NextConfig } from "next";

const cspFrameDomains = [
  "'self'",
  "https:",
  "data:",
  "blob:",
  "https://*.vidlink.pro",
  "https://vidlink.pro",
  "https://*.vidzee.wtf",
  "https://player.vidzee.wtf",
  "https://vidzee.wtf",
  "https://*.vidfast.pro",
  "https://vidfast.pro",
  "https://*.vidfast.vc",
  "https://vidfast.vc",
  "https://*.vidfast.co",
  "https://vidfast.co",
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
  "https://*.autoembed.me",
  "https://autoembed.me",
  "https://*.autoembed.cc",
  "https://autoembed.cc",
  "https://*.autoembed.to",
  "https://autoembed.to",
  "https://*.player.autoembed.co",
  "https://player.autoembed.co",
  "https://*.player.autoembed.me",
  "https://player.autoembed.me",
  "https://*.player.autoembed.cc",
  "https://player.autoembed.cc",
  "https://*.vidsrc.to",
  "https://vidsrc.to",
  "https://*.vidsrc.me",
  "https://vidsrc.me",
  "https://*.vidsrc.sh",
  "https://vidsrc.sh",
  "https://*.vidsrc.cc",
  "https://vidsrc.cc",
  "https://*.vidsrc.net",
  "https://vidsrc.net",
  "https://*.vidsrc.in",
  "https://vidsrc.in",
  "https://*.vidsrc.pm",
  "https://vidsrc.pm",
  "https://*.vidsrc.xyz",
  "https://vidsrc.xyz",
  "https://*.vidsrc.rip",
  "https://vidsrc.rip",
  "https://*.embed.su",
  "https://embed.su",
  "https://*.multiembed.mov",
  "https://multiembed.mov",
  "https://*.streamingnow.mov",
  "https://streamingnow.mov",
  "https://*.2embed.cc",
  "https://2embed.cc",
  "https://*.2embed.skin",
  "https://2embed.skin",
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
