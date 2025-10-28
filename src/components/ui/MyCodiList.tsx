'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { CreateClient } from '@/libs/supabase/client';
import ImageForm from './ImageForm';
import ImageList from './ImageList';
import Modal from './Modal';

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

  // 삭제 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCodiId, setSelectedCodiId] = useState<string | null>(null);

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
    try {
      const { error } = await supabase
        .from('board')
        .delete()
        .eq('board_uuid', board_uuid);

      if (error) throw error;

      // 상태 갱신
      setMyCodi((prev) => prev.filter((codi) => codi.id !== board_uuid));

      toast.success('코디가 삭제되었습니다!');
    } catch (err) {
      console.error('코디 삭제 오류:', err);
      toast.error('코디 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedCodiId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCodiId) return;
    await removeCodi(selectedCodiId);
    setModalOpen(false);
    setSelectedCodiId(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setSelectedCodiId(null);
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
              onClick={() => handleDeleteClick(codi.id)}
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

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={modalOpen}
        title="코디 삭제"
        onClose={handleCancelDelete}
        height="40%"
      >
        <p className="text-center mb-4">정말로 이 코디를 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancelDelete}
            className="px-4 py-2 border rounded-lg bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={() => void handleConfirmDelete()}
            className="px-4 py-2 border rounded-lg bg-gray-700 text-white"
          >
            삭제
          </button>
        </div>
      </Modal>
    </div>
  );
}
