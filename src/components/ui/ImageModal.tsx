'use client';

import React from 'react';
import BackButton from '@/components/ui/BackButton';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  src?: string;
  children?: React.ReactNode;
}

export default function ImageModal({
  open,
  onClose,
  src,
  children,
}: ImageModalProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* 닫기 버튼 (BackButton 활용) */}
      <BackButton onClick={onClose} className="w-auto px-2 py-2">
        닫기
      </BackButton>

      {/* 이미지 or 내용 */}
      <div className="flex-1 flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt="image preview"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-[18px] font-semibold">{children}</div>
        )}
      </div>
    </div>
  );
}
