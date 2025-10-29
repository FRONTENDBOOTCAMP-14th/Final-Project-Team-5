'use client';

import { useState } from 'react';
import FavoriteCodiList from './FavoriteCodiList';
import MyCodiList from './MyCodiList';

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState<'favorite' | 'my'>('favorite');

  return (
    <div className="w-full pb-[72px]">
      <div
        role="group"
        aria-label="코디 탭 선택"
        className="flex border-b border-gray-300"
      >
        <button
          type="button"
          aria-label="관심코디 탭으로 이동"
          onClick={() => setActiveTab('favorite')}
          className={`w-1/2 pb-2 text-center font-medium transition-colors ${
            activeTab === 'favorite'
              ? 'text-blue-500 font-semibold'
              : 'text-gray-500'
          }`}
        >
          관심 코디
        </button>
        <button
          type="button"
          aria-label="나의코디 탭으로 이동"
          onClick={() => setActiveTab('my')}
          className={`w-1/2 pb-2 text-center font-medium transition-colors ${
            activeTab === 'my' ? 'text-blue-500 font-semibold' : 'text-gray-500'
          }`}
        >
          나의 코디
        </button>
      </div>
      <div>
        {activeTab === 'favorite' ? <FavoriteCodiList /> : <MyCodiList />}
      </div>
    </div>
  );
}
