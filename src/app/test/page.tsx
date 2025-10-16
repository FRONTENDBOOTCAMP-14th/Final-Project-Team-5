// 여기서 컴포넌트 테스트 해주세용!

'use client';

import Frame from '@/components/ui/Frame';
import ImageForm from '@/components/ui/ImageForm';
import ImageList from '@/components/ui/ImageList';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';

import Notification from '@/components/ui/Notification';
import OnboardingModal from '@/components/ui/OnboardingModal';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function Home() {
  // 알림창 다이얼로그 기능 테스트용 상태
  const [openDialog, setOpenDialog] = useState(false);
  // 웰컴 모달 테스트
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Frame>
      <Modal></Modal>
      {/* 알림창 오픈확인을 위한 임시버튼 */}
      <button
        className="border rounded-xl p-1 cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        알림창 열기 버튼(테스트용)
      </button>
      <Notification
        title="알림"
        contents="알림메세지 입니다."
        button1="취소"
        button2="확인"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      <Toaster position="top-center" />
      <ImageForm />
      <Spinner size="sm" className="py-2"></Spinner>
      <ImageList src="/" />
      <WeatherDashboard
      // src="/weather/sunny.svg"
      // width={22}
      // height={22}
      // location="강남구 역삼동"
      // condition="맑음"
      />
      <OnboardingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Frame>
  );
}
