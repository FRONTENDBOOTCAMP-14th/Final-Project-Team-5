'use client';

import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import ImageForm from '@/components/ui/ImageForm';
import ImageList from '@/components/ui/ImageList';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import SnsButton from '@/components/ui/SnsButton';
import Spinner from '@/components/ui/Spinner';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import { Toaster } from 'sonner';

export default function Home() {
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
      <Toaster position="top-center" />
      <ImageForm />
      <Spinner size="sm" className="py-2"></Spinner>
      <ImageList src1="/" src2="/" />
      <div className="flex gap-4 justify-center p-8">
        <SnsButton
          provider="kakao"
          onClick={() => console.log('카카오 클릭')}
        />
        <SnsButton provider="google" onClick={() => console.log('구글 클릭')} />
      </div>
      <WeatherDashboard
        src="/weather/sunny.svg"
        width={22}
        height={22}
        location="강남구 역삼동"
        condition="맑음"
      />
    </Frame>
  );
}
