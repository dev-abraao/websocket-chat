import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental:{
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  images: {
    domains: ['minio.slocksert.dev'],
  }
};

export default nextConfig;