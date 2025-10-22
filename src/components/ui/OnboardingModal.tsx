'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
}: OnboardingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="relative w-full max-w-md h-[50%] bg-gradient-to-b from-blue-200 via-blue-50 to-white rounded-t-2xl p-4 flex flex-col justify-center"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* 설명 */}
            <div id="modal-description" className="flex items-center mb-10">
              <CircleCheck className="w-5 h-5 mr-2" aria-hidden="true" />
              <p className="text-sm text-gray-700 font-bold">
                회원가입이 완료되었습니다.
              </p>
            </div>

            {/* 타이틀 */}
            <h2
              id="modal-title"
              className="text-2xl font-bold leading-loose mb-16"
            >
              오늘뭐입지와 함께
              <br />
              코디해보아요.
            </h2>

            {/* 시작하기 버튼 */}
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400"
            >
              시작하기
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
