import '@/styles/main.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '오늘뭐입지 - 날씨 기반 옷 추천 서비스',
  description:
    '실시간 날씨에 맞는 스타일별 코디 추천 - 취향에 맞는 옷차림 찾기',
  icons: {
    icon: '/hanger/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  );
}
