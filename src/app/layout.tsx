import '@/styles/main.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '오늘뭐입지 랜딩페이지',
  description: '오늘뭐입지 랜딩페이지(로그인) 입니다.',
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
