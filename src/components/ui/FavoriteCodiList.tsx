'use client';

import { Heart } from 'lucide-react';
import { useCodiStore } from '@/libs/supabase/codistore';
import ImageList from './ImageList';

export default function FavoriteCodiList() {
  const { codiList, toggleLike } = useCodiStore();
  const favoriteCodi = codiList.filter((codi) => codi.liked);

  return (
    <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
      {favoriteCodi.length === 0 ? (
        <p className="text-gray-500">관심 등록한 코디가 없습니다.</p>
      ) : (
        favoriteCodi.map((codi) => (
          <ImageList key={codi.id} src={codi.imageUrl}>
            <button
              type="button"
              aria-label={codi.liked ? '관심코디 취소' : '관심코디 등록'}
              onClick={() => toggleLike(codi.id)}
              className="absolute bottom-2 right-2 text-white"
            >
              <Heart
                size={22}
                fill={codi.liked ? 'red' : 'white'}
                stroke="black"
              />
            </button>
          </ImageList>
        ))
      )}
    </div>
  );
}
