'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ImageUp } from 'lucide-react';
import { toast } from 'sonner';
import { useCodiStore } from '@/libs/supabase/codistore';

interface Props {
  onBack?: () => void;
}

export default function ImageForm({ onBack }: Props) {
  const { addCodi } = useCodiStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);

  // 파일명 및 파일이미지 미리보기
  const [fileName, setFileName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hashtag, setHashtag] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setFileName('');
      setPreviewImage(null);
    }
  };

  // 파일 선택없이 업로드 버튼 클릭시 상태알림
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    const input = fileInputRef.current;

    if (!input?.files || input.files.length === 0) {
      toast.error('파일을 선택해주세요!');
      return;
    }

    // 해시태그 유효성 검사
    const trimmedHashtag = hashtag.trim();
    if (trimmedHashtag && !trimmedHashtag.startsWith('#')) {
      toast.error('해시태그는 #으로 시작해야 합니다.');
      return;
    }

    try {
      setIsUploading(true);
      //supabase 업로드 로직
      addCodi({ imageUrl: previewImage, hashtag: trimmedHashtag });

      // 실제 업로드 성공시 알림
      toast.success('사진 업로드가 완료되었습니다!');

      //업로드 후 초기화
      setFileName('');
      setPreviewImage(null);
      setHashtag('');

      if (onBack) onBack();
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error('사진 업로드가 실패하였습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-3"
      onSubmit={(e) => void handleUpload(e)}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center justify-center pl-16"
        >
          <ArrowLeft />
        </button>
      )}
      {/* 사진 업로드시 클릭하여 진행 */}
      <label htmlFor="imageUpload" className="cursor-pointer">
        {/* 이미지 미리보기 */}
        {previewImage ? (
          <img
            src={previewImage}
            alt="이미지 미리보기"
            width={135}
            height={135}
            className="object-contain rounded-xl"
          />
        ) : (
          <ImageUp size={74} aria-hidden="true" className="mt-8" />
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        id="imageUpload"
        className="hidden"
        disabled={isUploading}
        onChange={handleInput}
        ref={fileInputRef}
      />
      {/* 업로드 파일명 보여주기 */}
      {fileName && <p>{fileName}</p>}
      {/* 업로드 완료시 버튼 */}
      <button
        type="submit"
        className="w-[135px] px-2.5 py-0.5 border rounded-2xl border-[#736F6F] cursor-pointer whitespace-nowrap text-xs text-[#736F6F]"
        disabled={isUploading}
      >
        코디사진 업로드하기
      </button>
      {/* 해시태그 입력 필드*/}
      <input
        type="text"
        placeholder="나의 코디를 #해시태그를 이용하여 자랑해보아요!"
        value={hashtag}
        onChange={(e) => setHashtag(e.target.value)}
        className="border p-3 mt-4 mb-4 text-xs text-black text-center w-full max-w-[300px] h-[120px]"
        disabled={isUploading}
      />
    </form>
  );
}
