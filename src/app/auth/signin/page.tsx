'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import { CreateClient } from '@/libs/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const supabase = CreateClient();

  async function HandleSignIn(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        alert('로그인 성공!');
        router.push('/');
      }
    } catch (error: unknown) {
      console.error('로그인 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleSignIn(e);
  }

  return (
    <Frame>
      <div className="flex flex-col h-full px-8 py-8">
        {/* 로그인 폼 */}
        <form onSubmit={HandleSubmit} className="flex-1 flex flex-col mt-32">
          <div className="space-y-6 mb-auto">
            <Input
              id="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="패스워드"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Button type="submit" className="mb-10">
              로그인
            </Button>

            <div className="flex flex-col items-center">
              <Image
                src="/hanger/logo.png"
                alt="오늘뭐입지 로고"
                width={40}
                height={40}
                className="mb-2"
              />
              <p className="text-sm font-semibold">오늘뭐입지</p>
            </div>
          </div>
        </form>
      </div>
    </Frame>
  );
}
