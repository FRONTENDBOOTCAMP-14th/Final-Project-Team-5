'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { CreateClient } from '@/libs/supabase/client';
import ImageForm from './ImageForm';
import ImageList from './ImageList';

interface CodiItem {
  id: string;
  imageUrl: string;
  createdAt: string | null;
  isMyCodi: boolean;
}

export default function MyCodiList() {
  const supabase = CreateClient();
  const [myCodi, setMyCodi] = useState<CodiItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCodi, setLoadingCodi] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUserId(data.user?.id ?? null);
      } catch (err) {
        console.error('getUser error', err);
        setUserId(null);
      } finally {
        setLoadingUser(false);
      }
    }
    void fetchUser();
  }, [supabase]);

  const fetchMyCodiForUser = useCallback(
    async (uid: string) => {
      setLoadingCodi(true);
      try {
        const { data, error } = await supabase
          .from('board')
          .select('board_uuid, image, created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (error) throw error;

        interface BoardRow {
          board_uuid?: string | null;
          image?: string | null;
          created_at?: string | null;
        }

        const parsed: CodiItem[] = (data || [])
          .filter(Boolean)
          .map((b: BoardRow) => ({
            id: String(b.board_uuid),
            imageUrl: String(b.image),
            createdAt: b.created_at ?? null,
            isMyCodi: true,
          }))
          .filter((c) => c.id && c.imageUrl);

        setMyCodi(parsed);
      } catch (err) {
        console.error('내 코디 불러오기 오류:', err);
        setMyCodi([]);
      } finally {
        setLoadingCodi(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (!userId) return;
    void fetchMyCodiForUser(userId);
  }, [userId, fetchMyCodiForUser]);

  const removeCodi = async (board_uuid: string) => {
    if (!confirm('정말로 코디를 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('board')
      .delete()
      .eq('board_uuid', board_uuid);

    if (error) {
      console.error('코디 삭제 오류:', error);
      return;
    }

    if (userId) void fetchMyCodiForUser(userId);
  };

  if (loadingUser || loadingCodi)
    return <div className="p-4">불러오는 중...</div>;

  if (!userId)
    return (
      <div className="p-4 text-center">
        <p>로그인해야 코디를 등록할 수 있습니다.</p>
      </div>
    );

  if (myCodi.length === 0 || showForm)
    return (
      <ImageForm
        userId={userId}
        onBack={() => setShowForm(false)}
        onSubmitSuccess={() => {
          setShowForm(false);
          void fetchMyCodiForUser(userId);
        }}
      />
    );

  return (
    <div>
      <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
        {myCodi.map((codi) => (
          <ImageList key={codi.id} src={codi.imageUrl}>
            <button
              type="button"
              aria-label="코디 삭제"
              onClick={() => void removeCodi(codi.id)}
              className="absolute top-0 right-0 bg-white text-black p-0.5 rounded-full border-2 border-black"
            >
              <X size={8} />
            </button>
          </ImageList>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          aria-label="코디 등록"
          onClick={() => setShowForm(true)}
          className="w-1/2 flex justify-center my-4 border-2 rounded-2xl border-black"
        >
          나의 코디 등록하기
        </button>
      </div>
    </div>
  );
}
