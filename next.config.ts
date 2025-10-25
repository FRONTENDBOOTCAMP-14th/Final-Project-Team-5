import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 이미지 설정
  images: {
    domains: [
      'search1.kakaocdn.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  eslint: {
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  turbopack: {},
};

export default nextConfig;
