'use client';
import { House, UserRoundPen } from 'lucide-react';

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[72px] flex bg-white border-t border-gray-200">
      {/* 왼쪽 버튼 */}
      <button className="w-1/2 h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
        <House className="w-[22px] h-[22px] text-black mb-0.5" />
        <span className="text-[12px] text-black font-medium">홈</span>
      </button>

      {/* 오른쪽 버튼 */}
      <button className="w-1/2 h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
        <UserRoundPen className="w-[22px] h-[22px] text-black mb-0.5" />
        <span className="text-[12px] text-black font-medium">프로필</span>
      </button>
    </div>
  );
}
