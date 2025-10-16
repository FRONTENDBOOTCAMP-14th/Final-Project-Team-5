'use client';

import { ImageUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCodiStore } from '../../libs/supabase/codistore';

export default function ImageForm() {
  const { addCodi } = useCodiStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);

  // 파일명 및 파일이미지 미리보기
  const [fileName, setFileName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
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

    setIsUploading(true);
    addCodi(previewImage);

    // 실제 업로드 성공시 알림
    toast.success('사진 업로드가 완료되었습니다!');
  };

  // 업로드 실패알림
  useEffect(() => {
    if (error) {
      toast.error('사진 업로드가 실패하였습니다. 다시 시도해주세요.');
    }
  }, [error]);

  return (
    <form className="flex flex-col items-center gap-3" onSubmit={handleUpload}>
      {/* 사진 업로드시 클릭하여 진행 */}
      <label htmlFor="imageUpload" className="cursor-pointer">
        {/* 이미지 미리보기 */}
        {previewImage ? (
          <img
            src={previewImage}
            alt="이미지 미리보기"
            className="w-[135px] h-[135px] object-contain rounded-xl"
          />
        ) : (
          <ImageUp size={74} aria-hidden="true" />
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
        className="w-33 px-2.5 py-0.5 border-1 rounded-2xl border-[#736F6F] cursor-pointer whitespace-nowrap text-sm text-[#736F6F]"
        disabled={isUploading}
      >
        코디사진 업로드하기
      </button>
    </form>
  );
}
