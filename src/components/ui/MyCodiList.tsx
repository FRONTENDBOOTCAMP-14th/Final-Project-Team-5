'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CreateClient } from '@/libs/supabase/client';
import ImageForm from './ImageForm';
import ImageList from './ImageList';

export default function MyCodiList() {
  const supabase = CreateClient();
  const [myCodi, setMyCodi] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    }
    void fetchUser();
  }, [supabase]);

  const fetchMyCodi = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('board')
      .select('board_uuid, image, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('내 코디 불러오기 오류:', error);
      setMyCodi([]);
    } else {
      setMyCodi(
        (data || []).map((b: any) => ({
          id: b.board_uuid,
          imageUrl: b.image,
          createdAt: b.created_at,
          isMyCodi: true,
        }))
      );
    }
  };

  const removeCodi = async (board_uuid: string) => {
    const confirmed = confirm('정말로 코디를 삭제하시겠습니까?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('board')
      .delete()
      .eq('board_uuid', board_uuid);

    if (error) {
      console.error('코디 삭제 오류:', error);
      return;
    }

    await fetchMyCodi();
  };

  useEffect(() => {
    if (userId) void fetchMyCodi();
  }, [userId]);

  useEffect(() => {
    if (myCodi.length === 0) setShowForm(true);
  }, [myCodi.length]);

  if (showForm && userId) {
    return (
      <ImageForm
        userId={userId}
        onBack={myCodi.length > 0 ? () => setShowForm(false) : undefined}
        onSubmitSuccess={() => void fetchMyCodi()}
      />
    );
  }

  return (
    <div>
      {myCodi.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}
