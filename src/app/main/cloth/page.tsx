'use client';

import Frame from '@/components/ui/Frame';
import KeywordList from '@/components/ui/KeywordList';
import MainCarousel from '@/components/ui/MainCarousel';
import NavigationBar from '@/components/ui/NavigationBar';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import WeatherSimpleBar from '@/components/ui/WeatherSimpleBar';

export default function LandingPage() {
  const keywords = [
    '심플',
    '캐주얼',
    '키치',
    '러블리',
    '오피스',
    '미니멀',
    '스트릿',
    '빈티지',
    '모던',
    '페미닌',
    '시크',
    '댄디',
    '스포티',
    '유니크',
    '내추럴',
    '레트로',
    '트렌디',
    '꾸안꾸',
    '세련된',
    '프레피',
  ];

  return (
    <Frame paddingX={24} color="#D2E4FB">
      <WeatherDashboard />
      <WeatherSimpleBar
        location="강남구 역삼동"
        time="오후 2시"
        style={{ marginTop: 20 }}
      />
      <span className="inline-block text-[18px] mt-[25px] font-bold">
        이렇게 입어보는거 어떤가요?
      </span>
      <MainCarousel />
      <span>이렇게 입어보는 것도 추천해요!</span>
      <KeywordList keywords={keywords} />
      <NavigationBar />
    </Frame>
  );
}
