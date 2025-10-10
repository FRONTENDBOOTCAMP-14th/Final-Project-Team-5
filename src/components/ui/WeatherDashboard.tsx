import { ChevronRight, MapPin } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

const weatherProps = {
  src: '/weather/sunny.svg',
  width: 22,
  height: 22,
  location: '강남구 역삼동',
  condition: '맑음',
};

interface ImageProps {
  src: string | StaticImageData;
  width: number;
  height: number;
  location: string;
  condition: string;
}

export default function WeatherDashboard(props: ImageProps) {
  return (
    <div className="w-[340px] h-[228px] p-3 rounded-2xl mx-auto bg-[#FFFFFF]">
      {/* 위치 및 더보기 버튼 */}
      <div className="flex place-content-between">
        {/* 현재위치 클릭시 내 위치선택 모달창 연결 */}
        <button type="button" className="flex gap-[1px] cursor-pointer">
          <MapPin />
          {props.location}
        </button>
        {/* 더보기 클릭시 현재위치 날씨 및 일주일 기상정보 페이지로 이동 */}
        <Link href="/" className="flex">
          더보기
          <ChevronRight />
        </Link>
      </div>
      {/* 현재 온도 및 간략한 날씨정보란 */}
      <div className="flex place-content-between my-7">
        <div className="text-5xl font-bold">25°C</div>
        <div>
          <p className="flex">
            <Image
              src={props.src}
              alt="날씨아이콘"
              width={props.width}
              height={props.height}
            />
            {props.condition}
          </p>
          <p>최저 20°C 최고 27°C</p>
        </div>
      </div>
      {/* 시간대별 날씨 */}
      {/* 추후 api 작업시 map으로 반복렌더링 적용예정 */}
      <div className="flex gap-5 overflow-x-auto overscroll-x-auto ">
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">지금</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">오전 10시</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">오전 11시</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">오후 12시</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">오후 1시</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">오후 2시</p>
          <p>25°C</p>
          <Image
            src={props.src}
            alt="날씨아이콘"
            width={props.width}
            height={props.height}
          />
        </div>
      </div>
    </div>
  );
}
