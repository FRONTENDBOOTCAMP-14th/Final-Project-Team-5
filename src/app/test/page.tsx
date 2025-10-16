// 여기서 컴포넌트 테스트 해주세용!

'use client';

import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import ImageForm from '@/components/ui/ImageForm';
import ImageList from '@/components/ui/ImageList';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import SnsButton from '@/components/ui/SnsButton';
import Spinner from '@/components/ui/Spinner';

import Notification from '@/components/ui/Notification';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function Home() {
  // 알림창 다이얼로그 기능 테스트용 상태
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Frame>
      <Button>로그인</Button>
      <Input
        id="email"
        name="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
      />
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
      <div className="flex gap-4 justify-center p-8">
        <SnsButton
          provider="kakao"
          onClick={() => console.log('카카오 클릭')}
        />
        <SnsButton provider="google" onClick={() => console.log('구글 클릭')} />
      </div>
      <WeatherDashboard />
    </Frame>
  );
}
