'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import { CreateClient } from '@/libs/supabase/client';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const router = useRouter();
  const supabase = CreateClient();

  function HandleBack() {
    router.back();
  }

  async function HandleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update`,
      });

      if (error) {
        throw error;
      }

      setIsSent(true);
      toast.success('비밀번호 재설정 이메일이 발송되었습니다.');
    } catch (error: unknown) {
      console.error('비밀번호 재설정 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '비밀번호 재설정 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleResetPassword(e);
  }

  return (
    <Frame>
      <div className="flex flex-col justify-center h-full px-8 py-8">
        <form
          onSubmit={HandleSubmit}
          className="flex-1 flex flex-col justify-center"
        >
          {!isSent ? (
            <>
              {/* 첫 번째 페이지: 이메일 입력 */}
              <div className="space-y-6 mb-auto">
                <h1 className="text-2xl font-bold mb-32">비밀번호 찾기</h1>
                <p className="text-sm text-gray-600 mb-8">
                  가입하신 이메일 주소를 입력하시면
                  <br />
                  비밀번호 재설정 링크를 보내드립니다.
                </p>

                <Input
                  id="email"
                  type="email"
                  label="이메일"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col mt-8">
                <Button type="submit" className="mb-10">
                  이메일 전송
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
            </>
          ) : (
            <>
              {/* 두 번째 페이지: 이메일 발송 완료 */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/email/email.png"
                      alt="이메일"
                      width={64}
                      height={64}
                    />
                  </div>

                  <p className="text-xl font-bold">이메일을 확인해주세요!</p>
                  <p className="text-sm text-gray-600">
                    {email}으로
                    <br />
                    비밀번호 재설정 링크를 보냈습니다.
                    <br />
                    <br />
                    이메일의 링크를 클릭하여
                    <br />
                    비밀번호를 재설정해주세요.
                  </p>
                </div>
              </div>

              <div className="flex flex-col mt-8">
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
            </>
          )}
        </form>
      </div>
    </Frame>
  );
}
