'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import useGeoLocation from '@/hooks/useGeoLocation';
import GetLocation from '@/libs/getLocation';
import GetWeather, { GetWeatherForecast } from '@/libs/getWeather';
import GetWeatherIcon, {
  GetWeatherCondition,
} from '@/utils/getWeatherCondition';

export default function WeatherDashboard() {
  const [locationData, setLocationData] = useState<any | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [temp, setTemp] = useState<any | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [forecastTime, setForecastTime] = useState<any[]>([]);
  const [forecastTemp, setForecastTemp] = useState<any[]>([]);
  const [forecastIcon, setForecastIcon] = useState<any[]>([]);

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();

  // 현재 위치 기반 날씨 가져오기
  useEffect(() => {
    if (!lat || !lon) return;

    const abortController = new AbortController();

    async function fetchWeatherData() {
      try {
        const weatherData = await GetWeather(lat, lon);
        setData(weatherData);
      } catch (error) {
        toast.error('위치불러오기 에러 발생!!');
      }
    }

    fetchWeatherData();

    return () => {
      abortController.abort();
    };
  }, [lat, lon]);

  const locationTemp = Math.ceil(data?.main.temp) || '현재 온도';

  // 날씨에 따른 아이콘 설정
  const condition = data?.weather?.[0]?.main ?? '';
  const iconPath = GetWeatherIcon(condition);

  // 날씨표기
  const conditionDescription = data?.weather?.[0]?.description ?? '';
  const description = GetWeatherCondition(conditionDescription);

  // 하루 최저,최고기온 구하기
  useEffect(() => {
    if (!lat || !lon) return;

    const abortController = new AbortController();

    async function fetchTempData() {
      try {
        const temp = await GetWeatherForecast(lat, lon);
        setTemp(temp);
        console.log('예측정보값', temp);

        const nowTempData = temp.list.filter((item: any) => {
          const tempData = new Date(item.dt * 1000);
          const test = String(tempData.toLocaleDateString());
          const now = String(new Date().toLocaleDateString());
          return test === now;
        });

        console.log('나와라', nowTempData);

        const maxArray = [];
        const minArray = [];

        for (let i = 0; i < nowTempData.length; i++) {
          const max_value = Math.max(temp.list[i].main.temp_max);
          maxArray.push(max_value);
          const min_value = Math.min(temp.list[i].main.temp_min);
          minArray.push(min_value);
        }

        const maxTemp = Math.ceil(Math.max(...maxArray));
        const minTemp = Math.ceil(Math.min(...minArray));

        setMaxTemp(maxTemp);
        setMinTemp(minTemp);
      } catch (error) {
        toast.error('날씨 예측정보 에러 발생!');
      }
    }

    fetchTempData();

    return () => {
      abortController.abort();
    };
  }, [lat, lon]);

  // 일기예보 시간대별 온도 구하기
  useEffect(() => {
    const timeArray = [];
    const tempArray = [];
    const iconArray = [];

    if (temp?.list?.length) {
      const limit = Math.min(6, temp.list.length);

      for (let i = 0; i < limit; i++) {
        const unixTime = temp?.list[i]?.dt;
        const unixToLocalTime = new Date(unixTime * 1000);
        const localTime = String(unixToLocalTime.getHours());
        timeArray.push(localTime);

        const timeTemp = temp?.list[i]?.main?.temp ?? 0;
        tempArray.push(Math.ceil(timeTemp));

        const timeicon = temp?.list[i]?.weather[0]?.main ?? '';
        iconArray.push(GetWeatherIcon(timeicon));
      }
    }

    // console.log('원인확인', timeArray);
    // console.log('온도도도', tempArray);
    // console.log('아이콘콘', iconArray);

    setForecastTime(timeArray);
    setForecastTemp(tempArray);
    setForecastIcon(iconArray);
  }, [temp]);

  // 현재 위치명 한국어로 변경
  useEffect(() => {
    if (!lat || !lon) return;

    try {
      (async () => {
        const location = await GetLocation(lat, lon);
        setLocationData(location);
        // console.log('한국어함수값', location);
      })();
    } catch (error) {
      console.error('한국어 번역 에러 발생!');
    }
  }, [lat, lon]);

  useEffect(() => {
    if (!locationData) return;

    const area1 = locationData.results?.[0]?.region?.area1?.name || '';
    const area2 = locationData.results?.[0]?.region?.area2?.name || '';
    const area3 = locationData.results?.[0]?.region?.area3?.name || '';

    const name = `${area1} ${area2} ${area3}` || '현재 위치';
    setLocationName(name);
    // console.log('지역:', area1, area2, area3);
  }, [locationData]);

  const pathName = usePathname();

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
        {pathName !== '/weather' && (
          <Link href="/weather" className="flex">
            더보기
            <ChevronRight />
          </Link>
        )}
      </div>
      {/* 현재 온도 및 간략한 날씨정보란 */}
      <div className="flex place-content-between my-7">
        <div className="text-5xl font-bold">
          {locationTemp ? `${locationTemp}°C` : '온도 불러오는 중'}
        </div>
        <div>
          <p className="flex">
            <Image src={iconPath} alt="날씨아이콘" width={22} height={22} />
            {description}
          </p>
          <p>
            최저 {minTemp}°C 최고 {maxTemp}°C
          </p>
        </div>
      </div>
      {/* 시간대별 날씨 */}
      <div className="flex gap-5 overflow-x-auto overscroll-x-auto ">
        <div className="flex flex-col items-center">
          <p className="text-sm whitespace-nowrap">지금</p>
          <p>{locationTemp}°C</p>
          <Image src={iconPath} alt="날씨아이콘" width={22} height={22} />
        </div>
        {forecastTime.map((hour, i) => (
          <div key={hour} className="flex flex-col items-center">
            <p className="text-sm whitespace-nowrap">{hour}시</p>
            <p>{forecastTemp[i]}°C</p>
            <Image
              src={forecastIcon[i]}
              alt="날씨아이콘"
              width={22}
              height={22}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
