'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreateClient } from '@/libs/supabase/client';
import Modal from './Modal';
import ProfileEditForm from './ProfileEditForm';
import type { PanInfo } from 'framer-motion';

interface Profile {
  username: string | null;
  profile_desc: string | null;
  profile_url: string | null;
  id?: string | null;
}

export default function ProfileSheet() {
  const supabase = CreateClient();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const dragThreshold = 80;

  const fetchProfile = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('username, profile_desc, profile_url')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.error('프로필 로드 실패:', error);
        setProfile({
          username: '닉네임',
          profile_desc: '한 줄 소개를 입력해주세요.',
          profile_url: '/profile/profileimage.png',
          id: user.id,
        });
        return;
      }

      setProfile({
        username: data.username || '닉네임',
        profile_desc: data.profile_desc || '한 줄 소개를 입력해주세요.',
        profile_url: data.profile_url || '/profile/profileimage.png',
        id: user.id,
      });
    } catch (err) {
      console.error('fetchProfile unexpected error:', err);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y < -dragThreshold) setIsOpen(false);
    else setIsOpen(true);
  };

  function handleAccountClick() {
    router.push('/account');
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {isOpen && (
        <div className="w-full flex justify-end mb-1 px-4 pt-4">
          <button
            className={`z-50 px-3 py-1 bg-white rounded-full text-xs transition-colors ${
              isEditing
                ? 'bg-gray-500 border border-black text-black'
                : 'bg-white border border-gray-500 text-gray-500'
            }`}
            onClick={handleAccountClick}
            aria-label="계정 설정 열기"
          >
            계정설정
          </button>
        </div>
      )}
      <motion.div
        className="w-full bg-white"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="w-full bg-white"
          animate={{ height: isOpen ? '40vh' : '60px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {isOpen ? (
            <div className="relative h-full flex flex-col items-center justify-center mt-4">
              <motion.div layout className="relative w-20 h-20">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {profile?.profile_url ? (
                    <Image
                      src={profile.profile_url}
                      alt="프로필 이미지"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-full" />
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-0.5"
                  aria-label="프로필 수정"
                >
                  <SquarePen size={15} />
                </button>
              </motion.div>
              <motion.span layout className="mt-3 text-lg font-semibold">
                {profile?.username || '닉네임 없음'}
              </motion.span>
              <motion.p
                layout
                className="mt-3 text-sm font-semibold text-gray-500"
              >
                {profile?.profile_desc || '한줄소개가 없습니다.'}
              </motion.p>
            </div>
          ) : (
            <motion.div layout className="h-full flex items-center px-4 gap-3">
              <motion.div
                layout
                className="w-10 h-10 rounded-full bg-white overflow-hidden"
              >
                {profile?.profile_url ? (
                  <Image
                    src={profile.profile_url}
                    alt="프로필 이미지"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </motion.div>
              <motion.span layout className="mt-3 text-sm font-semibold">
                {profile?.username || '닉네임 없음'}
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      {isEditing && profile && userId && (
        <Modal
          title="프로필 설정"
          height="90%"
          onClose={() => setIsEditing(false)}
        >
          <ProfileEditForm
            userId={userId}
            currentNickname={profile.username || ''}
            currentIntro={profile.profile_desc || ''}
            currentAvatarUrl={profile.profile_url || null}
            onClose={() => setIsEditing(false)}
            onProfileUpdate={(_updated) => {
              void fetchProfile().then(() => setIsEditing(false));
            }}
          />
        </Modal>
      )}
    </div>
  );
}
