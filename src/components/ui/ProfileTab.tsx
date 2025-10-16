'use client';

import { useState } from 'react';
// import { codiList } from '../../libs/supabase/Codilist';
import FavoriteCodiList from './FavoriteCodiList';
import MyCodiList from './MyCodiList';

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState<'favorite' | 'my'>('favorite');

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-[72px]">
      <div className="flex">
        <button
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
