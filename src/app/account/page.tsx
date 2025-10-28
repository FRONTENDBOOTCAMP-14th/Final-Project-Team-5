'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import Notification from '@/components/ui/Notification';
import { CreateClient } from '@/libs/supabase/client';

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const supabase = CreateClient();

  function HandleBack() {
    router.back();
  }

  // 비밀번호 변경
  async function HandlePasswordChange() {
    // 빈 값 검증
    if (!currentPassword.trim()) {
      toast.error('현재 비밀번호를 입력해주세요.');
      return;
    }

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
      // 현재 사용자 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        toast.error('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      // 현재 비밀번호로 재인증
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error('현재 비밀번호가 올바르지 않습니다.');
        return;
      }

      // 새 비밀번호로 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success('비밀번호가 변경되었습니다.');

      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error: unknown) {
      console.error('비밀번호 변경 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '비밀번호 변경 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  }

  function HandlePasswordChangeClick() {
    void HandlePasswordChange();
  }

  // 로그아웃
  function HandleLogoutClick() {
    setShowLogoutModal(true);
  }

  async function HandleLogoutConfirm() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success('로그아웃 되었습니다.');
      setShowLogoutModal(false);
      router.push('/');
    } catch (error: unknown) {
      console.error('로그아웃 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그아웃 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      setShowLogoutModal(false);
    }
  }

  function HandleLogoutButtonClick() {
    void HandleLogoutConfirm();
  }

  // 회원탈퇴
  function HandleDeleteClick() {
    setShowDeleteModal(true);
  }

  async function HandleDeleteConfirm() {
    try {
      // 현재 사용자 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      // API Route 호출 (삭제)
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원탈퇴 중 오류가 발생했습니다.');
      }

      // 로그아웃
      await supabase.auth.signOut();

      toast.success('회원탈퇴가 완료되었습니다.');
      setShowDeleteModal(false);
      router.push('/');
    } catch (error: unknown) {
      console.error('회원탈퇴 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '회원탈퇴 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      setShowDeleteModal(false);
    }
  }

  function HandleDeleteButtonClick() {
    void HandleDeleteConfirm();
  }

  return (
    <Frame>
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-center px-4 py-4 border-b">
          <button
            onClick={HandleBack}
            className="p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold ml-2">개인정보설정</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-6">
          {/* 비밀번호 변경 */}
          <div className="mb-auto">
            <div className="space-y-10 mt-8">
              <Input
                id="currentPassword"
                type="password"
                label="현재 비밀번호"
                placeholder="현재 비밀번호를 입력해주세요."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                showPasswordToggle
              />

              <Input
                id="newPassword"
                type="password"
                label="새 비밀번호"
                placeholder="변경할 비밀번호를 입력해주세요."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle
              />

              <Input
                id="newPasswordConfirm"
                type="password"
                label="새 비밀번호 확인"
                placeholder="변경할 비밀번호를 한번 더 입력해주세요."
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                showPasswordToggle
              />

              <Button
                onClick={HandlePasswordChangeClick}
                className="w-full bg-gray-300 hover:bg-gray-400"
              >
                비밀번호 변경
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-0 ">
            {/* 로그아웃 */}
            <button
              onClick={HandleLogoutClick}
              className="w-full flex items-center justify-between py-4 "
              aria-label="로그아웃"
            >
              <span className="text-base text-blue-600">로그아웃</span>
            </button>

            {/* 회원탈퇴 */}
            <button
              onClick={HandleDeleteClick}
              className="w-full text-left py-4"
              aria-label="회원탈퇴"
            >
              <span className="text-base text-red-600">회원탈퇴</span>
            </button>
          </div>
        </div>
      </div>

      {/* 로그아웃 알림창 */}
      <Notification
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="로그아웃 하시겠습니까?"
        contents={
          <span className="block text-sm text-gray-600">
            로그아웃 하시면 다시 로그인해야 합니다.
          </span>
        }
        button1="취소"
        button2={
          <span className="text-blue-500" onClick={HandleLogoutButtonClick}>
            로그아웃
          </span>
        }
      />

      {/* 회원탈퇴 알림창 */}
      <Notification
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="회원탈퇴 하시겠습니까?"
        contents={
          <span className="block text-sm text-gray-600">
            탈퇴시 아래 정보가 삭제됩니다.
            <br />
            <br />• 계정 정보
            <br />• 관심 코디
            <br />• 나의 코디
          </span>
        }
        button1="돌아가기"
        button2={
          <span className="text-red-500" onClick={HandleDeleteButtonClick}>
            탈퇴하기
          </span>
        }
      />
    </Frame>
  );
}
