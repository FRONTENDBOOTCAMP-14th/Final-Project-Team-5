'use client';

import React from 'react';
import { Heart } from 'lucide-react';
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

  /** ⬇️ 추가: 모달 우측 컨트롤용 */
  isBookmarked?: boolean;
  bookmarkCount?: number;
  onToggleBookmark?: () => void;
}

export default function ImageModal({
  open,
  onClose,
  data,
  isBookmarked = false,
  bookmarkCount,
  onToggleBookmark,
}: ImageModalProps) {
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
      <BackButton onClick={onClose} className="w-auto px-2 py-2 text-sm" />
      <div className="flex items-center justify-between p-3 border-b">
        {/* 좌측: 작성자 정보 (그대로) */}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="author avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{nickname}</span>
            <span className="text-xs text-gray-500">
              {keyword ? `#${keyword}` : ''} {createdAt ? `· ${createdAt}` : ''}
            </span>
          </div>
        </div>

        {/* 우측: 북마크 수 + 버튼 */}
        <div className="flex items-center gap-2">
          {typeof bookmarkCount === 'number' && (
            <span className="text-xs text-gray-700 min-w-[1ch] text-right">
              북마크 {bookmarkCount}
            </span>
          )}
          <button
            type="button"
            aria-pressed={isBookmarked}
            title={isBookmarked ? '북마크 해제' : '북마크 등록'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark?.();
            }}
            className="rounded-full bg-white/90 backdrop-blur px-2 py-1 shadow border border-gray-200 hover:bg-white"
          >
            <Heart
              className={
                isBookmarked ? 'w-5 h-5 text-red-500' : 'w-5 h-5 text-gray-700'
              }
              fill={isBookmarked ? 'currentColor' : 'transparent'}
            />
          </button>
        </div>
      </div>

      {/* 이미지 본문: 가로 100%, 높이는 비율대로 */}
      <div className="relative bg-gray-50">
        {src ? (
          <Image
            src={src}
            alt="image preview"
            width={1200}
            height={1600} // 대략 3:4 기본 비율 (실제는 width 100% / height auto로 렌더)
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            className="block object-contain"
            unoptimized
          />
        ) : (
          <div className="text-[18px] font-semibold text-gray-500 p-6">
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
