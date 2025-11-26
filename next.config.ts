import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: "http://localhost:8080/uploads/:path*" },
      { source: "/api/:path*", destination: "http://localhost:8080/api/:path*" },
    ];
  },
};

export default nextConfig;
