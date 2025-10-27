'use client';

import React from 'react';
import Image from 'next/image';
import BackButton from '@/components/ui/BackButton';

interface Author {
  username?: string | null;
  profile_url?: string | null;
}

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  data?: {
    image?: string | null;
    text?: string | null;
    keyword?: string | null;
    created_at?: string | null;
    author?: Author | null;
  };
}

export default function ImageModal({ open, onClose, data }: ImageModalProps) {
  if (!open || !data) return null;

  const src = data?.image ?? '';
  const nickname = data?.author?.username ?? '알 수 없음';
  const avatar = data?.author?.profile_url ?? '/hanger/logo.png';
  const text = data?.text ?? '';
  const keyword = data?.keyword ?? '';
  const createdAt = data?.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : '';

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* 상단 영역 */}
        {/* 닫기 버튼 */}
        <BackButton onClick={onClose} className="w-auto px-2 py-2 text-sm">
        </BackButton>
      <div className="flex items-center justify-between p-3 border-b">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="author avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{nickname}</span>
            <span className="text-xs text-gray-500">
              {keyword ? `#${keyword}` : ''}{' '}
              {createdAt ? `· ${createdAt}` : ''}
            </span>
          </div>
        </div>

      </div>

      {/* 이미지 본문 */}
      <div className="relative flex-1 flex items-center justify-center bg-gray-50">
        {src ? (
          <Image
            src={src}
            alt="image preview"
            fill
            className="object-contain"
            unoptimized // (Supabase signed URL이면 캐싱 없이 바로 표시)
          />
        ) : (
          <div className="text-[18px] font-semibold text-gray-500">
            이미지가 없습니다.
          </div>
        )}
      </div>

      {/* 게시글 설명 */}
      {text && (
        <div className="p-4 border-t text-sm text-gray-800 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}
