'use client';

import { Heart } from 'lucide-react';
import { useCodiStore } from '../../libs/supabase/codistore';
import ImageList from './ImageList';

export default function CodiList() {
  const { codiList, toggleLike } = useCodiStore();

  return (
    <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
      {codiList.map((codi) => (
        <ImageList key={codi.id} src={codi.imageUrl}>
          <button
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
      ))}
    </div>
  );
}
