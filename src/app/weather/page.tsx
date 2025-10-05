import { WeatherDashboard } from '@/components';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function WeatherDetails() {
  return (
    <>
      <ArrowLeft className="ml-11 mt-20 mb-4" />
      <WeatherDashboard
        src="/weather/sunny.svg"
        width={22}
        height={22}
        location="강남구 역삼동"
        condition="맑음"
      />
      <section className="flex flex-col mx-11">
        <h2 className="sr-only">일주일 일기예보</h2>
        <p className="text-[18px] font-medium text-left text-nowrap mt-7 mb-5">
          앞으로 7일 동안은 이런 날씨에요!
        </p>
        <div className="w-full h-[55px] bg-[#D2E4Fb] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>9.26</span>
            <span>오늘</span>
          </p>
          <Image
            src="/weather/sunny.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>9.27</span>
            <span>토</span>
          </p>
          <Image
            src="/weather/sunny.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>9.28</span>
            <span>일</span>
          </p>
          <Image
            src="/weather/sunny.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>9.29</span>
            <span>월</span>
          </p>
          <Image
            src="/weather/lightning.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>9.30</span>
            <span>화</span>
          </p>
          <Image
            src="/weather/rain.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>10.1</span>
            <span>수</span>
          </p>
          <Image
            src="/weather/cloudy.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
        <div className="w-full h-[55px] flex items-center justify-center">
          <p className="flex gap-4 mr-6">
            <span>10.2</span>
            <span>목</span>
          </p>
          <Image
            src="/weather/sunny.svg"
            alt="날씨아이콘"
            width={22}
            height={22}
          />
          <p className="flex ml-6">최저 20°C ~ 최고 27°C</p>
        </div>
      </section>
    </>
  );
}
