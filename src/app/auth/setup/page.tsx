'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Frame from '@/components/ui/Frame'
import Input from '@/components/ui/Input'
import { CreateClient } from '@/libs/supabase/client'

export default function SetupPage() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [userId, setUserId] = useState('')

  const router = useRouter()
  const supabase = CreateClient()

  useEffect(() => {
    async function GetUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUserId(user.id)

      // 이미 설정 완료했는지 확인
      const { data: _profile } = await supabase
        .from('profiles')
        .select('gender, username')
        .eq('id', user.id)
        .single()

      // if (_profile?.gender && _profile?.username) {
      //   router.push('/main/cloth');
      // }
    }

    void GetUser()
  }, [router, supabase])

  async function HandleComplete(e: React.FormEvent) {
    e.preventDefault()

    if (!gender) {
      alert('성별을 선택해주세요.')
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: name,
          gender,
        })
        .eq('id', userId)

      if (error) {
        throw error
      }

      alert('가입이 완료되었습니다!')
      router.push('/main/cloth')
    } catch (error: unknown) {
      console.error('정보 저장 에러:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : '정보 저장 중 오류가 발생했습니다.'
      alert(errorMessage)
    }
  }

  function HandleSubmit(e: React.FormEvent) {
    void HandleComplete(e)
  }

  return (
    <Frame>
      <div className="flex flex-col h-full px-8 py-6">
        <form onSubmit={HandleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-6 grow flex flex-col justify-center max-w-md w-full mx-auto">
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
  )
}
