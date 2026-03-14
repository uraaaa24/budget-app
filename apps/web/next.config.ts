import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/twitter/twemoji@14.0.2/assets/**",
      },
    ],
  },
};

export default nextConfig;
