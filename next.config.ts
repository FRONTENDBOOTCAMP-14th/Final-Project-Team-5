import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 이미지 설정
  images: {
    // kakaocdn의 경우, domains 추가 필요 (프로토콜 제외)
    domains: ['search1.kakaocdn.net', 'ldienmsbfilcckzrsbwu.supabase.co'],
    // 외부 이미지 경로 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ldienmsbfilcckzrsbwu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // ...
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
