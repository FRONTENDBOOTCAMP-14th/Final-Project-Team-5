'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { CreateClient } from '@/libs/supabase/client';
import ImageList from './ImageList';

interface FavoriteCodi {
  board_id: string;
  board: { image: string };
}

export default function FavoriteCodiList() {
  const supabase = CreateClient();
  const [favoriteList, setFavoriteList] = useState<FavoriteCodi[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    }
    void fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    async function fetchFavorites() {
      const uid = userId as string;
      const { data, error } = await supabase
        .from('bookmark')
        .select(`board_id, board ( image )`)
        .eq('user_id', uid);

      if (error) {
        console.error('관심목록 불러오기 실패:', error);
        return;
      }

      setFavoriteList(data as FavoriteCodi[]);
    }

    void fetchFavorites();
  }, [supabase, userId]);

  const toggleLike = async (board_id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('bookmark')
      .delete()
      .eq('board_id', board_id)
      .eq('user_id', userId);

    if (error) {
      console.error('관심코디 취소 실패:', error);
      return;
    }

    setFavoriteList((prev) =>
      prev.filter((codi) => codi.board_id !== board_id)
    );
  };

  if (favoriteList.length === 0) {
    return (
      <p className="text-gray-500 text-center">관심 등록한 코디가 없습니다.</p>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
      {favoriteList.map((codi) => (
        <ImageList key={codi.board_id} src={codi.board.image}>
          <button
            type="button"
            aria-label="관심코디 취소"
            onClick={() => void toggleLike(codi.board_id)}
            className="absolute bottom-2 right-2 text-white"
          >
            <Heart size={22} fill="red" stroke="black" />
          </button>
        </ImageList>
      ))}
    </div>
  );
}
