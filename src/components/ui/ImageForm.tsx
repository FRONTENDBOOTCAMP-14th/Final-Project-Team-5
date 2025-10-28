'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ImageUp } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { CreateClient } from '@/libs/supabase/client';
import FilterBar from './KeywordList';

interface Props {
  userId?: string;
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

export default function ImageForm({ onBack, onSubmitSuccess, userId }: Props) {
  const supabase = CreateClient();
  const [isUploading, setIsUploading] = useState(false);

  // 파일명 및 파일이미지 미리보기
  const [fileName, setFileName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFileName('');
      setPreviewImage(null);
    }
  };

  // 파일 선택없이 업로드 버튼 클릭시 상태알림
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileInputRef.current?.files?.length) {
      toast.error('파일을 선택해주세요!');
      return;
    }

    if (!keyword || !gender || !season) {
      toast.error('키워드, 성별, 시즌을 모두 선택해주세요.');
      return;
    }

    if (!userId) {
      toast.error('업로드하려면 로그인해야 합니다.');
      return;
    }

    const file = fileInputRef.current.files[0];
    setIsUploading(true);

    try {
      const imageStorage = supabase.storage.from('imageStorage');
      const filePath = `${userId}/${Date.now()}_${file.name}`;

      const { data: _uploadData, error: uploadError } =
        await imageStorage.upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = imageStorage.getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('퍼블릭 URL을 가져오지 못했습니다.');

      const { error: insertError } = await supabase.from('board').insert({
        image: publicUrl,
        text: description,
        user_id: userId,
        created_at: new Date().toISOString(),
        keyword,
        gender,
        season,
      });

      if (insertError) throw insertError;

      toast.success('사진 업로드가 완료되었습니다!');

      setFileName('');
      setPreviewImage(null);
      setDescription('');
      setKeyword(null);
      setGender(null);
      setSeason(null);

      onSubmitSuccess?.();
      onBack?.();
    } catch (error: unknown) {
      console.error(error);
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : String(error);
      toast.error(message || '업로드 실패! 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  // 필터 데이터 및 매핑
  const keywordItems = [
    '캐주얼',
    '스트릿',
    '미니멀',
    '스포티',
    '클래식',
    '워크웨어',
  ];
  const keywordMap: Record<string, string> = {
    캐주얼: 'casual',
    스트릿: 'street',
    미니멀: 'minimal',
    스포티: 'sporty',
    클래식: 'classic',
    워크웨어: 'workwear',
  };

  const genderItems = ['남성', '여성'];
  const genderMap: Record<string, string> = {
    남성: 'male',
    여성: 'female',
  };

  const seasonItems = ['봄', '여름', '가을', '겨울'];
  const seasonMap: Record<string, string> = {
    봄: 'spring',
    여름: 'summer',
    가을: 'autumn',
    겨울: 'winter',
  };

  return (
    <div className="pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center justify-center pl-16 cursor-pointer"
        >
          <ArrowLeft aria-label="뒤로가기" />
        </button>
      )}
      <form
        className="flex flex-col items-center gap-3"
        onSubmit={(e) => void handleUpload(e)}
      >
        {/* 사진 업로드시 클릭하여 진행 */}
        <label htmlFor="imageUpload" className="cursor-pointer">
          {/* 이미지 미리보기 */}
          {previewImage ? (
            <Image
              src={previewImage}
              alt="이미지 미리보기"
              width={500}
              height={500}
              className="object-contain rounded-xl w-[40%] h-auto"
              loading="lazy"
            />
          ) : (
            <ImageUp
              size={74}
              aria-label="이미지 업로드하기"
              className="mt-8"
            />
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
        {/* 필터버튼 입력 필드*/}
        <div className="flex flex-wrap gap-2 mb-2">
          <FilterBar
            items={keywordItems}
            mapToValue={keywordMap}
            selectedItem={keyword ?? ''}
            onSelect={setKeyword}
          />
          <FilterBar
            items={genderItems}
            mapToValue={genderMap}
            selectedItem={gender ?? ''}
            onSelect={setGender}
          />
          <FilterBar
            items={seasonItems}
            mapToValue={seasonMap}
            selectedItem={season ?? ''}
            onSelect={setSeason}
          />
        </div>
        {/* 코디 설명 필드 */}
        <textarea
          id="codiDescription"
          placeholder="나의 코디를 소개해보세요!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-5 mt-4 mb-4 text-xs text-black text-center w-full max-w-[300px] h-[120px]"
          disabled={isUploading}
        />
        <label htmlFor="codiDescription" className="sr-only">
          코디 소개 글
        </label>
      </form>
    </div>
  );
}
