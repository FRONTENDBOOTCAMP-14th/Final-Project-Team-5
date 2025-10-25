'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import { CreateClient } from '@/libs/supabase/client';

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const router = useRouter();
  const supabase = CreateClient();

  function HandleBack() {
    router.back();
  }

  useEffect(() => {
    async function CheckSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('유효하지 않은 접근입니다.');
        router.push('/auth/signin');
      }
    }

    void CheckSession();
  }, [router, supabase]);

  async function HandleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    // 빈 값 검증
    if (!newPassword.trim()) {
      toast.error('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!newPasswordConfirm.trim()) {
      toast.error('새 비밀번호 확인을 입력해주세요.');
      return;
    }

    // 비밀번호 길이 검증
    if (newPassword.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 비밀번호 일치 검증
    if (newPassword !== newPasswordConfirm) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        // Supabase 에러 처리
        if (
          error.message.includes('different') ||
          error.message.includes('same')
        ) {
          toast.error('새 비밀번호가 기존 비밀번호와 동일합니다.');
          return;
        }
        throw error;
      }

      toast.success('비밀번호가 변경되었습니다.');
      router.push('/auth/signin');
    } catch (error: unknown) {
      console.error('비밀번호 변경 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '비밀번호 변경 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleUpdatePassword(e);
  }

  return (
    <Frame>
      <div className="flex flex-col justify-center h-full px-8 py-8">
        <form
          onSubmit={HandleSubmit}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="space-y-8 mb-auto">
            <h1 className="text-2xl font-bold mb-32">새 비밀번호 설정</h1>

            <Input
              id="newPassword"
              type="password"
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력해주세요."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showPasswordToggle
            />

            <Input
              id="newPasswordConfirm"
              type="password"
              label="새 비밀번호 확인"
              placeholder="새 비밀번호를 한번 더 입력해주세요."
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              showPasswordToggle
            />
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit" className="mb-10">
              비밀번호 변경
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
