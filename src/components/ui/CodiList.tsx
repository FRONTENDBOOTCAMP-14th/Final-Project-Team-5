'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { CreateClient } from '@/libs/supabase/client';
import ImageList from './ImageList';
import Button from './FilterButton';

interface Codi {
  board_uuid: string;
  image: string;
  liked: boolean;
  keyword: string;
  gender: string;
  season: string;
  bookmark?: { user_id: string }[];
}

export default function CodiList() {
  const supabase = CreateClient();
  const [codiList, setCodiList] = useState<Codi[]>([]);
  const [filteredList, setFilteredList] = useState<Codi[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const keywords = [
    '캐주얼',
    '스트릿',
    '미니멀',
    '스포티',
    '클래식',
    '워크웨어',
  ];
  const genders = ['남', '여'];
  const seasons = ['봄', '여름', '가을', '겨울'];

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('유저 정보 불러오기 실패:', error);
        return;
      }
      setUserId(data.user?.id ?? null);
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    const fetchCodiList = async () => {
      const { data, error } = await supabase
        .from('board')
        .select(
          `board_uuid, image, keyword, gender, season, bookmark(user_id)`
        );

      if (error) {
        console.error('코디 불러오기 실패:', error);
        return;
      }

      const listWithLikes = data.map((item: any) => ({
        ...item,
        liked: item.bookmark?.some((b: any) => b.user_id === userId) ?? false,
      }));

      setCodiList(listWithLikes);
      setFilteredList(listWithLikes);
    };

    fetchCodiList();
  }, [supabase, userId]);

  useEffect(() => {
    let list = [...codiList];

    if (selectedKeyword) {
      list = list.filter((codi) => codi.keyword === selectedKeyword);
    }
    if (selectedGender) {
      list = list.filter((codi) => codi.gender === selectedGender);
    }
    if (selectedSeason) {
      list = list.filter((codi) => codi.season === selectedSeason);
    }

    setFilteredList(list);
  }, [selectedKeyword, selectedGender, selectedSeason, codiList]);

  const toggleLike = async (board_uuid: string, liked: boolean) => {
    let error: any = null;
    if (liked) {
      const { error: deleteError } = await supabase
        .from('bookmark')
        .delete()
        .eq('board_id', board_uuid)
        .eq('user_id', userId);
      error = deleteError;
    } else {
      const { error: insertError } = await supabase.from('bookmark').insert({
        board_id: board_uuid,
        user_id: userId,
      });
      error = insertError;
    }

    if (error) {
      console.error('관심코디 등록 실패:', error);
      return;
    }

    setCodiList((prev) =>
      prev.map((codi) =>
        codi.board_uuid === board_uuid ? { ...codi, liked: !liked } : codi
      )
    );
  };

  return (
    <div className="max-w-md mx-auto w-full p-4">
      <div className="flex overflow-x-auto gap-2 mb-4">
        {keywords.map((k) => (
          <Button
            key={k}
            type="button"
            onClick={() => setSelectedKeyword(selectedKeyword === k ? null : k)}
            aria-pressed={selectedKeyword === k}
          >
            {k}
          </Button>
        ))}
        {genders.map((g) => (
          <Button
            key={g}
            type="button"
            onClick={() => setSelectedGender(selectedGender === g ? null : g)}
            aria-pressed={selectedGender === g}
          >
            {g}
          </Button>
        ))}
        {seasons.map((s) => (
          <Button
            key={s}
            type="button"
            onClick={() => setSelectedSeason(selectedSeason === s ? null : s)}
            aria-pressed={selectedSeason === s}
          >
            {s}
          </Button>
        ))}
      </div>
      <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
        {codiList.map((codi) => (
          <ImageList key={codi.board_uuid} src={codi.image}>
            <button
              type="button"
              aria-label={codi.liked ? '관심코디 취소' : '관심코디 등록'}
              onClick={() => toggleLike(codi.board_uuid, codi.liked)}
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
    </div>
  );
}
