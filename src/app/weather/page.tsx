'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import type { WeatherData } from '@/@types/global.d.ts';
import { Frame, WeatherDashboard } from '@/components';
import useGeoLocation from '@/hooks/useGeoLocation';
import { GetWeatherForecast } from '@/libs/getWeather';
import GetWeatherIcon from '@/utils/getWeatherCondition';

export default function WeatherDetails() {
  const [date, setDate] = useState<string[]>([]);
  const [dayName, setDayName] = useState<string[]>([]);
  const [dayMinTemp, setDayMinTemp] = useState<number[]>([]);
  const [dayMaxTemp, setDayMaxTemp] = useState<number[]>([]);
  const [dayWeatherIcon, setDayWeatherIcon] = useState<string[]>([]);

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();
  // 현재 위치의 5일간의 최저, 최고기온 구하기
  useEffect(() => {
    if (!lat || !lon) return;

    const abortController = new AbortController();

    async function fetchWeekWeather() {
      try {
        const temp = await GetWeatherForecast(lat, lon);

        const dailyGroup: Record<string, WeatherData[]> = {};

        for (let i = 0; i < temp.list.length; i++) {
          const item = temp.list[i];
          const weekDate = String(item.dt_txt.split(' ')[0]);

          if (!dailyGroup[weekDate]) {
            dailyGroup[weekDate] = [];
          }
          dailyGroup[weekDate].push(item);
        }

        // 하루의 최저, 최고 기온 구하기
        let mins;
        let maxs;
        const minsArray = [];
        const maxsArray = [];

        let weatherConditions;
        let weatherCondition;
        const weatherConditionArray = [];

        for (let j = 0; j < Object.entries(dailyGroup).length; j++) {
          const [, items] = Object.entries(dailyGroup)[j];
          mins = items.map((item) => item.main.temp_min);
          maxs = items.map((item) => item.main.temp_max);
          const dayMinTemp = Math.round(Math.min(...mins));
          const dayMaxTemp = Math.round(Math.max(...maxs));
          minsArray.push(dayMinTemp);
          maxsArray.push(dayMaxTemp);

          setDayMinTemp(minsArray);
          setDayMaxTemp(maxsArray);

          weatherConditions = items.map((item) => item.weather[0].main);
          weatherCondition = GetWeatherIcon(weatherConditions[0]);
          weatherConditionArray.push(weatherCondition);
        }
        setDayWeatherIcon(weatherConditionArray);
      } catch (error) {
        console.error(error);
        toast.error('날씨 예측정보 에러 발생!');
      }
    }

    void fetchWeekWeather();

    return () => {
      abortController.abort();
    };
  }, [lat, lon]);

  // 날짜 및 요일 구하기
  useEffect(() => {
    const times: string[] = [];
    const names: string[] = [];

    for (let i = 0; i < 6; i++) {
      const now = new Date();
      now.setDate(now.getDate() + i);

      const month = String(now.getMonth() + 1);
      const day = String(now.getDate());
      const dayNameArray = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = dayNameArray[now.getDay()];

      const formattedDate = `${month}.${day}`;
      const formattedDayName = `${dayName}`;

      times.push(formattedDate);
      names.push(formattedDayName);
    }
    setDate(times);
    setDayName(names);
  }, []);

  return (
    <Frame>
      <ArrowLeft className="ml-11 mt-20 mb-4" />
      <WeatherDashboard />
      <section className="flex flex-col mx-11">
        <h2 className="sr-only">일주일 일기예보</h2>
        <p className="text-[18px] font-medium text-left text-nowrap mt-7 mb-5">
          앞으로 7일 동안은 이런 날씨에요!
        </p>

        {date.map((d: string, i: number) => (
          <div
            key={d}
            className={`w-full h-[55px] ${i === 0 ? 'bg-[#D2E4Fb]' : ''} flex items-center justify-center`}
          >
            <p className="flex gap-4 mr-6">
              <span>{d}</span>
              <span className="w-[28px] text-center">
                {i === 0 ? '오늘' : dayName[i]}
              </span>
            </p>
            {dayWeatherIcon[i] && (
              <Image
                src={dayWeatherIcon[i]}
                alt="날씨아이콘"
                width={22}
                height={22}
              />
            )}
            <p className="flex ml-6 w-[155px] text-nowrap justify-between">
              <span>최저 {dayMinTemp[i]}°C</span>~
              <span>최고 {dayMaxTemp[i]}°C</span>
            </p>
          </div>
        ))}
      </section>
    </Frame>
  );
}
