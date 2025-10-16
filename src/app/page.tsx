'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Frame from '@/components/ui/Frame'
import SnsButton from '@/components/ui/SnsButton'
import { CreateClient } from '@/libs/supabase/client'

export default function LandingPage() {
  const supabase = CreateClient()

  async function HandleKakaoLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: unknown) {
      console.error('카카오 로그인 에러:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : '카카오 로그인 중 오류가 발생했습니다.'
      alert(errorMessage)
    }
  }

  async function HandleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: unknown) {
      console.error('구글 로그인 에러:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : '구글 로그인 중 오류가 발생했습니다.'
      alert(errorMessage)
    }
  }

  function HandleKakaoClick() {
    void HandleKakaoLogin()
  }

  function HandleGoogleClick() {
    void HandleGoogleLogin()
  }

  return (
    <Frame>
      <div className="flex flex-col items-center h-full px-8 pt-20">
        {/* 로고 */}
        <div className="mb-4">
          <Image
            src="/hanger/logo.png"
            alt="오늘뭐입지 로고"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* 타이틀 */}
        <h1 className="text-3xl font-bold mb-20">오늘뭐입지</h1>

        {/* SNS 로그인 */}
        <div className="w-full mb-8">
          <p className="text-center text-xs text-gray-600 mb-4">
            SNS 계정으로 간편 가입하기
          </p>
          <div className="flex justify-center gap-4">
            <SnsButton provider="kakao" onClick={HandleKakaoClick} />
            <SnsButton provider="google" onClick={HandleGoogleClick} />
          </div>
        </div>

        {/* 구분선 */}
        <div className="flex items-center w-full mb-10 mt-8">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-xs text-gray-500">또는</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* 버튼 영역 */}
        <div className="w-full space-y-4">
          <Link href="/auth/signin" className="block">
            <Button className="hover:bg-blue-300">이메일 로그인</Button>
          </Link>
          <Link href="/auth/signup" className="block">
            <Button className="bg-gray-300 hover:bg-gray-400">회원가입</Button>
          </Link>
        </div>
      </div>
    </Frame>
  )
}
