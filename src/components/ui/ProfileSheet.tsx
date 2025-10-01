'use client';

import { motion, PanInfo } from 'framer-motion';
import { useState } from 'react';

export default function ProfileSheet() {
  const [isOpen, setIsOpen] = useState(true);
  const dragThreshold = 80;

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.y < -dragThreshold) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  return (
    <motion.div
      className="relative min-h-screen"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-white p-4"
        animate={{ height: isOpen ? '40vh' : '60px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {isOpen ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-full flex justify-end mb-4">
              {/* 계정설정버튼 */}
            </div>
            <motion.div
              layout
              className="w-20 h-20 rounded-full bg-white overflow-hidden"
            >
              {/* 프로필이미지 */}
            </motion.div>
            <motion.span layout className="mt-3 text-lg font-semibold">
              {/* 아이디 */}
            </motion.span>
            <motion.p
              layout
              className="mt-3 text-sm font-semibold text-gray-500"
            >
              {/* 한줄소개 */}
            </motion.p>
          </div>
        ) : (
          <motion.div layout className="h-full flex items-center px-4 gap-3">
            <motion.div
              layout
              className="w-10 h-10 rounded-full bg-white overflow-hidden"
            >
              {/* 프로필이미지 */}
            </motion.div>
            <motion.span layout className="mt-3 text-sm font-semibold">
              {/* 아이디 */}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
