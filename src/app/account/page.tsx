'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  function HandlePasswordChange() {
    // 비밀번호 변경
  }

  function HandleLogout() {
    // 로그아웃
  }

  function HandleDeleteAccount() {
    // 회원탈퇴
  }

  return (
    <Frame>
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-center px-4 py-4 border-b">
          <h1 className="text-lg font-semibold ml-2">개인정보설정</h1>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          {/* 비밀번호 변경 */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4">비밀번호 변경</h2>

            <div className="space-y-8">
              <Input
                id="currentPassword"
                type="password"
                label="현재 비밀번호"
                placeholder="현재 비밀번호를 입력해주세요."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <Input
                id="newPassword"
                type="password"
                label="새 비밀번호"
                placeholder="변경할 비밀번호를 입력해주세요."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                id="newPasswordConfirm"
                type="password"
                label="새 비밀번호 확인"
                placeholder="변경할 비밀번호를 한번 더 입력해주세요."
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />

              <Button
                onClick={HandlePasswordChange}
                className="w-full bg-gray-300 hover:bg-gray-400"
              >
                변경
              </Button>
            </div>
          </div>

          {/* 로그아웃 */}
          <button
            onClick={HandleLogout}
            className="w-full flex items-center justify-between py-4"
          >
            <span className="text-base">로그아웃</span>
          </button>

          {/* 회원탈퇴 */}
          <button
            onClick={HandleDeleteAccount}
            className="w-full text-left py-4"
          >
            <span className="text-base text-red-500">회원탈퇴</span>
          </button>
        </div>
      </div>
    </Frame>
  );
}
