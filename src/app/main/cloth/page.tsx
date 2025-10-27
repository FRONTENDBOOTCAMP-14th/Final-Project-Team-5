'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Frame from '@/components/ui/Frame';
import ImageList from '@/components/ui/ImageList';
// import ImageModal from '@/components/ui/ImageModal';
import KeywordList from '@/components/ui/KeywordList';
import MainCarousel from '@/components/ui/MainCarousel';
import NavigationBar from '@/components/ui/NavigationBar';
import OnboardingModal from '@/components/ui/OnboardingModal';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import WeatherSimpleBar from '@/components/ui/WeatherSimpleBar';
import { CreateClient } from '@/libs/supabase/client';

export default function LandingPage() {
  const [_modalOpen, _setModalOpen] = React.useState(false);
  const [_selectedImage, _setSelectedImage] = React.useState<string | null>(
    null
  );
  const [showOnboarding, setShowOnboarding] = useState(false);

  const router = useRouter();
  const supabase = CreateClient();

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

  // 온보딩 모달 상태 체크
  useEffect(() => {
    async function CheckOnboardingStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('has_seen_onboarding')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('프로필 조회 에러:', error);
          return;
        }

        // 온보딩 모달 안 봤으면 모달 표시
        if (profile && !profile.has_seen_onboarding) {
          setShowOnboarding(true);
        }
      } catch (error: unknown) {
        console.error('온보딩 체크 에러:', error);
      }
    }

    void CheckOnboardingStatus();
  }, [router, supabase]);

  // 온보딩 모달 닫기 및 상태 업데이트
  async function HandleOnboardingClose() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ has_seen_onboarding: true })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setShowOnboarding(false);
    } catch (error: unknown) {
      console.error('온보딩 상태 업데이트 에러:', error);
      setShowOnboarding(false);
    }
  }

  function HandleOnboardingButtonClick() {
    void HandleOnboardingClose();
  }

  const handleImageClick = (src: string) => {
    _setSelectedImage(src);
    _setModalOpen(true);
  };

  return (
    <Frame paddingX={24} color="#D2E4FB">
      <WeatherDashboard />
      <WeatherSimpleBar style={{ marginTop: 20 }} />
      <span className="inline-block text-[18px] mt-[25px] font-bold">
        이렇게 입어보는거 어떤가요?
      </span>
      <MainCarousel />
      <span>이렇게 입어보는 것도 추천해요!</span>
      <KeywordList keywords={keywords} />
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            onClick={() => handleImageClick(`/images/sample${n}.jpg`)}
            className="cursor-pointer"
          >
            <ImageList src={`/images/sample${n}.jpg`} />
          </div>
        ))}
      </div>

      <NavigationBar />
      {/* <ImageModal
        open={_modalOpen}
        onClose={() => _setModalOpen(false)}
        src={_selectedImage ?? undefined}
      /> */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={HandleOnboardingButtonClick}
      />
    </Frame>
  );
}
