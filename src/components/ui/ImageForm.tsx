'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ImageUp } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { CreateClient } from '@/libs/supabase/client';
import Button from './FilterButton';

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
  const [hashtag, setHashtag] = useState('');
  const [keyword, setKeyword] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setFileName('');
      setPreviewImage(null);
    }
  };

  // 파일 선택없이 업로드 버튼 클릭시 상태알림
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewImage) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch {}
      }
    };
  }, [previewImage]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = fileInputRef.current;

    if (!input?.files?.length) {
      toast.error('파일을 선택해주세요!');
      return;
    }

    const trimmedHashtag = hashtag.trim();
    if (trimmedHashtag && !trimmedHashtag.startsWith('#')) {
      toast.error('해시태그는 #으로 시작해야 합니다.');
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

    const file = input.files[0];
    setIsUploading(true);

    try {
      // Supabase 스토리지 버킷 지정
      const imageStorage = supabase.storage.from('imageStorage');

      // 파일 경로 지정
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      console.log('uploading to path:', filePath, 'bucket: imageStorage');

      // 파일 업로드
      const { data: uploadData, error: uploadError } =
        await imageStorage.upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('uploadError', uploadError);
        toast.error(
          `사진 업로드 실패: ${uploadError.message || '알 수 없는 오류'}`
        );
        return;
      }

      console.log('uploadData', uploadData);

      // 퍼블릭 URL 생성
      const { data: urlData } = imageStorage.getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        console.error('publicUrl is empty', urlData);
        toast.error('업로드는 되었지만 퍼블릭 URL을 가져오지 못했습니다.');
        return;
      }

      // ✅ Supabase DB에 삽입
      const { error: insertError } = await supabase.from('board').insert({
        image: publicUrl,
        text: trimmedHashtag,
        user_id: userId,
        created_at: new Date().toISOString(),
        keyword,
        gender,
        season,
      });

      if (insertError) {
        console.error('insertError', insertError);
        toast.error('데이터 저장 실패!');
        return;
      }

      toast.success('사진 업로드가 완료되었습니다!');

      // 초기화
      setFileName('');
      setPreviewImage(null);
      setHashtag('');
      setKeyword(null);
      setGender(null);
      setSeason(null);

      if (previewImage) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch {}
      }

      onSubmitSuccess?.();
      onBack?.();
    } catch (error) {
      console.error('unexpected error', error);
      toast.error('사진 업로드가 실패하였습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

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

  return (
    <>
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
          {keywords.map((k) => (
            <Button
              key={k}
              type="button"
              onClick={() => setKeyword(k)}
              aria-pressed={keyword === k}
            >
              {k}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {genders.map((g) => (
            <Button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              aria-pressed={gender === g}
            >
              {g}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {seasons.map((s) => (
            <Button
              key={s}
              type="button"
              onClick={() => setSeason(s)}
              aria-pressed={season === s}
            >
              {s}
            </Button>
          ))}
        </div>
        {/* 해시태그 입력 필드*/}
        <input
          type="text"
          id="imageDescription"
          placeholder="나의 코디를 #해시태그를 이용하여 자랑해보아요!"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          className="border p-3 mt-4 mb-4 text-xs text-black text-center w-full max-w-[300px] h-[120px]"
          disabled={isUploading}
        />
        <label htmlFor="imageDescription" className="sr-only">
          코디소개글
        </label>
      </form>
    </>
  );
}
