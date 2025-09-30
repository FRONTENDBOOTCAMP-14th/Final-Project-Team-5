'use client';

import { useState } from 'react';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>내 위치 선택(모달 열기)</button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative w-full max-w-md h-[80%] bg-white rounded-t-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">내 위치 선택</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover-gray-700"
              >
                ✕
              </button>
            </div>
            <div>{/* 인풋 및 버튼 추가  */}</div>
          </div>
        </div>
      )}
    </div>
  );
}
