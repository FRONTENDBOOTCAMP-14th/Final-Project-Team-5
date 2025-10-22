'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import { CreateClient } from '@/libs/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const supabase = CreateClient();

  function HandleBack() {
    router.back();
  }

  async function HandleSignIn(e: React.FormEvent) {
    e.preventDefault();

    // 빈 값 검증
    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('로그인 성공!');
        router.push('/main/cloth');
      }
    } catch (error: unknown) {
      console.error('로그인 에러:', error);

      let errorMessage = '로그인 중 오류가 발생했습니다.';

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (message.includes('email not confirmed')) {
          errorMessage = '이메일 인증이 필요합니다.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleSignIn(e);
  }

  return (
    <Frame>
      <div className="flex flex-col justify-center h-full px-8 py-8">
        {/* 로그인 폼 */}
        <form
          onSubmit={HandleSubmit}
          className="flex-1 flex flex-col justify-center mt-32"
        >
          <div className="space-y-6 mb-auto">
            <Input
              id="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              type="password"
              label="패스워드"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
            />
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit" className="mb-10">
              로그인
            </Button>

            <button
              type="button"
              onClick={HandleBack}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src="/hanger/logo.png"
                alt="오늘뭐입지 로고"
                width={40}
                height={40}
                className="mb-2"
              />
              <p className="text-sm font-semibold">오늘뭐입지</p>
            </button>
          </div>
        </form>
      </div>
    </Frame>
  );
}
