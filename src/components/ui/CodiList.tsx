'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { CreateClient } from '@/libs/supabase/client';
import type { Database } from '@/libs/supabase/database.types';
import Button from './FilterButton';
import ImageList from './ImageList';

type BoardRow = Database['public']['Tables']['board']['Row'];
type BookmarkRow = Database['public']['Tables']['bookmark']['Row'];

interface Codi extends Partial<Omit<BoardRow, 'bookmark'>> {
  liked: boolean;
  bookmark?: { user_id: string }[];
  // board 테이블에 gender/season 컬럼이 없을 수 있으므로 optional로 둡니다
  gender?: string | null;
  season?: string | null;
  keyword?: string | null;
  image?: string | null;
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
  const genders = ['male', 'female'];
  const seasons = ['spring', 'summer', 'autumn', 'winter'];

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('유저 정보 불러오기 실패:', error);
        return;
      }
      setUserId(data.user?.id ?? null);
    };

    void fetchUser();
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

      // Supabase 응답의 타입이 명확하지 않으므로 적절히 캐스팅
      const rows = data as unknown as
        | (BoardRow & { bookmark?: BookmarkRow[] })[]
        | null;

      const listWithLikes: Codi[] = (rows ?? []).map((item) => ({
        ...item,
        liked:
          item.bookmark?.some((b: BookmarkRow) => b.user_id === userId) ??
          false,
      }));

      setCodiList(listWithLikes);
      setFilteredList(listWithLikes);
    };

    void fetchCodiList();
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

  const toggleLike = async (
    board_uuid: string,
    liked: boolean
  ): Promise<void> => {
    // userId는 로그인한 사용자 ID가 필요합니다. 없으면 동작 중단
    if (!userId) {
      console.error('로그인한 사용자 정보가 없습니다.');
      return;
    }

    let error = null;
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
        {[...keywords, ...genders, ...seasons].map((item) => {
          const isKeyword = keywords.includes(item);
          const isGender = genders.includes(item);
          const isSeason = seasons.includes(item);

          const isSelected =
            (isKeyword && selectedKeyword === item) ||
            (isGender && selectedGender === item) ||
            (isSeason && selectedSeason === item);

          const handleClick = () => {
            if (isKeyword) setSelectedKeyword(isSelected ? null : item);
            else if (isGender) setSelectedGender(isSelected ? null : item);
            else if (isSeason) setSelectedSeason(isSelected ? null : item);
          };

          return (
            <Button
              key={item}
              type="button"
              onClick={handleClick}
              aria-pressed={isSelected}
            >
              {item}
            </Button>
          );
        })}
      </div>
      <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
        {filteredList
          .filter(
            (codi): codi is Codi & { board_uuid: string; image: string } =>
              Boolean(codi.board_uuid && codi.image)
          )
          .map((codi) => (
            <ImageList key={codi.board_uuid} src={codi.image}>
              <button
                type="button"
                aria-label={codi.liked ? '관심코디 취소' : '관심코디 등록'}
                onClick={() => void toggleLike(codi.board_uuid, codi.liked)}
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
