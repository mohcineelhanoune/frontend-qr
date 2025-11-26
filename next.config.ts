import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: "https://qr.devura.ma/uploads/:path*" },
      { source: "/api/:path*", destination: "https://qr.devura.ma/api/:path*" },
    ];
  },
};

export default nextConfig;
