'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { CreateClient } from '@/libs/supabase/client';
import Button from './Button';
import Input from './Input';

interface ProfileEditFormProps {
  userId: string;
  currentNickname: string;
  currentIntro: string;
  currentAvatarUrl?: string | null;
  onClose: () => void;
  onProfileUpdate: (updated: {
    nickname: string;
    intro: string;
    avatar_url?: string | null;
  }) => void;
}

export default function ProfileEditForm({
  userId,
  currentNickname,
  currentIntro,
  currentAvatarUrl,
  onClose,
  onProfileUpdate,
}: ProfileEditFormProps) {
  const supabase = CreateClient();
  const [nickname, setNickname] = useState(currentNickname);
  const [intro, setIntro] = useState(currentIntro);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentAvatarUrl || null
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      toast.success('이미지 업로드 완료');
    } catch (err) {
      console.error(err);
      toast.error(
        `이미지 업로드 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: nickname,
          profile_desc: intro,
          profile_url: avatarUrl,
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('프로필이 수정되었습니다.');
      onProfileUpdate({ nickname, intro, avatar_url: avatarUrl });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('프로필 수정 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* 아바타 이미지 변경 */}
      <div className="flex flex-col items-center">
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          aria-label="프로필 사진 변경"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt="avatar" fill className="object-cover" />
          ) : (
            <Image
              src="/profile/profileimage.png"
              alt="기본 아바타"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="mt-2 w-full flex justify-center">
          <button
            type="button"
            className="w-auto px-2 py-0.5 text-xs mb-10 bg-white border border-gray-300 text-gray-700 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            프로필 사진 변경
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
          }}
        />
      </div>
      {/* 닉네임 변경 (label + input) */}
      <div className="w-full mb-4">
        <Input
          id="nickname"
          label="닉네임 변경"
          value={nickname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNickname(e.target.value)
          }
          placeholder="변경할 닉네임을 입력해주세요."
        />
      </div>
      {/* 한 줄 소개 수정 */}
      <div className="w-full mb-10">
        <Input
          id="intro"
          label="한 줄 소개 수정"
          value={intro}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setIntro(e.target.value)
          }
          placeholder="한 줄 소개를 입력해주세요."
        />
      </div>

      {/* 수정하기 버튼 */}
      <div className="w-full mt-3">
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          className="bg-gray-300 text-black w-full"
        >
          {loading ? '저장 중...' : '수정하기'}
        </Button>
      </div>
    </div>
  );
}
