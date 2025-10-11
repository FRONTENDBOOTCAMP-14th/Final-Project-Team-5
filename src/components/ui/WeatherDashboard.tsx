'use client';

import { ChevronRight, MapPin } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

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
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  // const [location, setLocation] = useState(null);
  const [locdata, setLocdata] = useState(null);
  const [data, setData] = useState(null);

  // 현재 위치 가져오기
  useEffect(() => {
    function OnGeoOk(position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    }

    console.log('첫번째', lat, lon);

    function OnGeoError() {
      throw new Error('Can not find you!');
    }

    navigator.geolocation.getCurrentPosition(OnGeoOk, OnGeoError);
  }, []);

  useEffect(() => {
    // 현재 위치 기반 날씨 가져오기
    async function FetchWeatherData() {
      const URL = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      if (!URL) {
        throw new Error('API URL is not defined!');
      }

      if (!API_KEY) {
        throw new Error('API KEY is not defined!');
      }

      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error('날씨 데이터를 가져오지 못했습니다!');
        const responseData = await response.json();
        setData(responseData);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    }

    if (lat && lon) {
      FetchWeatherData();
    }
  }, [lat, lon]);

  console.log('두번째', data?.main?.temp);

  const locationTemp = data?.main.temp || '현재 온도';

  // 현재 위치명 한국어로 변경
  useEffect(() => {
    async function TranslateLocation() {
      const TransURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=6&appid=${API_KEY}`;

      try {
        const ress = await fetch(TransURL);
        if (!ress.ok) throw new Error('반대 데이터를 가져오지 못했습니다!');
        const ressData = await ress.json();
        setLocdata(ressData);
        console.log(ressData);
      } catch (error) {
        console.log(error);
      }
    }

    TranslateLocation();
  }, [lat, lon]);

  useEffect(() => {
    if (!locdata) return;
    console.log('세번째', locdata?.[0]?.local_names?.ko);
  }, [locdata]);

  const locationName = locdata?.[0]?.local_names?.ko || '현재 위치';

  return (
    <div className="w-[340px] h-[228px] p-3 rounded-2xl mx-auto bg-[#FFFFFF]">
      {/* 위치 및 더보기 버튼 */}
      <div className="flex place-content-between">
        {/* 현재위치 클릭시 내 위치선택 모달창 연결 */}
        <button type="button" className="flex gap-[1px] cursor-pointer">
          <MapPin />
          {locationName}
        </button>
        {/* 더보기 클릭시 현재위치 날씨 및 일주일 기상정보 페이지로 이동 */}
        <Link href="/" className="flex">
          더보기
          <ChevronRight />
        </Link>
      </div>
      {/* 현재 온도 및 간략한 날씨정보란 */}
      <div className="flex place-content-between my-7">
        <div className="text-5xl font-bold">{locationTemp}°C</div>
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
