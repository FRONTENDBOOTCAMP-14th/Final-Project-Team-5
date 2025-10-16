'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import { CreateClient } from '@/libs/supabase/client';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const router = useRouter();
  const supabase = CreateClient();

  async function HandleSignUp(e: React.FormEvent) {
    e.preventDefault();

    // 비밀번호 확인 검증
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 성별 선택 확인
    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }

    try {
      const { data: _authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
            gender,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      alert('회원가입이 완료되었습니다!');
      router.push('/auth/signin');
    } catch (error: unknown) {
      console.error('회원가입 에러:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '회원가입 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleSignUp(e);
  }

  return (
    <Frame>
      <div className="flex flex-col h-full px-8 py-6">
        {/* 회원가입 폼 */}
        <form onSubmit={HandleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-4 mb-auto">
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

            <Input
              id="passwordConfirm"
              type="password"
              label="패스워드 확인"
              placeholder="비밀번호를 한번 더 입력해주세요."
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />

            <Input
              id="name"
              type="text"
              label="이름"
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                성별
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 px-4 py-3 rounded-full border font-medium transition-colors ${
                    gender === 'male'
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-gray-500 bg-white text-gray-700'
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 px-4 py-3 rounded-full border font-medium transition-colors ${
                    gender === 'female'
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-gray-500 bg-white text-gray-700'
                  }`}
                >
                  여성
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <Button type="submit" className="mb-6">
              회원가입
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
