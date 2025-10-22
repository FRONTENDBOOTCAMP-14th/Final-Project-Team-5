'use client';

import React from 'react';
import { House, UserRoundPen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavigationBarType extends React.FC {
  $$frameFooter?: true;
}

const NavigationBar: NavigationBarType = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 w-full h-[72px] flex bg-white border-t border-gray-200">
      {/* 왼쪽 버튼 - /main/cloth 이동 */}
      <button
        className="w-1/2 h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
        onClick={() => router.push('/main/cloth')}
      >
        <House className="w-[22px] h-[22px] text-black mb-0.5" />
        <span className="text-[12px] text-black font-medium">Home</span>
      </button>

      {/* 오른쪽 버튼 - /profile 이동 */}
      <button
        className="w-1/2 h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
        onClick={() => router.push('/profile')}
      >
        <UserRoundPen className="w-[22px] h-[22px] text-black mb-0.5" />
        <span className="text-[12px] text-black font-medium">Profile</span>
      </button>
    </div>
  );
};

NavigationBar.$$frameFooter = true;

export default NavigationBar;
