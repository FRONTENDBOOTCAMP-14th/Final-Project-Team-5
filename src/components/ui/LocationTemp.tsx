'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import type { WeatherData, TempData } from '@/@types/global.d.ts';
import useGeoLocation from '@/hooks/useGeoLocation';
import GetWeather, { GetWeatherForecast } from '@/libs/getWeather';
import { useWeatherStore } from '@/libs/store/weatherStore';
import GetWeatherIcon, {
  GetWeatherCondition,
} from '@/utils/getWeatherCondition';

export default function LocationTemp() {
  const [data, setData] = useState<WeatherData | undefined>();
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [temp, setTemp] = useState<TempData | null>(null);
  const [forecastTime, setForecastTime] = useState<string[]>([]);
  const [forecastTemp, setForecastTemp] = useState<number[]>([]);
  const [forecastIcon, setForecastIcon] = useState<string[]>([]);

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();

  // 변경 위치 가져오기
  const { currentLat, currentLon, setCurrentTemp } = useWeatherStore();

  const updateLat = currentLat ?? lat;
  const updateLon = currentLon ?? lon;

  useEffect(() => {
    if (!updateLat || !updateLon) return;

    const abortController = new AbortController();

    // 현재 위치 기반 날씨 가져오기
    async function FetchWeatherData() {
      try {
        const weatherData = await GetWeather(updateLat, updateLon);
        setData(weatherData);
      } catch (error) {
        console.error(error);
        toast.error('현재 위치를 불러오지 못했습니다!');
      }
    }

    // 하루 최저,최고기온 구하기
    async function FetchTempData() {
      try {
        const temp = await GetWeatherForecast(updateLat, updateLon);
        setTemp(temp);

        const today = temp.list[0].dt_txt.split(' ')[0];
        const todayWeather = temp.list.filter((d: WeatherData) => {
          const std = d.dt_txt.split(' ')[0];
          return std.includes(today);
        });

        const maxArray: number[] = [];
        const minArray: number[] = [];

        for (let i = 0; i < todayWeather.length; i++) {
          const max_value = Math.max(temp.list[i].main.temp_max);
          maxArray.push(max_value);
          const min_value = Math.min(temp.list[i].main.temp_min);
          minArray.push(min_value);
        }

        const maxTemp = Math.round(Math.max(...maxArray));
        const minTemp = Math.round(Math.min(...minArray));

        setMaxTemp(maxTemp);
        setMinTemp(minTemp);
      } catch (error) {
        console.error(error);
        toast.error('날씨 예측정보를 불러올 수 없습니다!');
      }
    }

    void FetchWeatherData();
    void FetchTempData();

    return () => {
      abortController.abort();
    };
  }, [updateLat, updateLon]);

  // 일기예보 시간대별 온도 구하기
  useEffect(() => {
    const timeArray: string[] = [];
    const tempArray: number[] = [];
    const iconArray: string[] = [];

    if (temp?.list?.length) {
      const limit = Math.min(8, temp.list.length);

      for (let i = 0; i < limit; i++) {
        const unixTime = temp?.list[i]?.dt;
        if (unixTime !== undefined) {
          const unixToLocalTime = new Date(unixTime * 1000);
          const localTime = String(unixToLocalTime.getHours());
          timeArray.push(localTime);
        }

        const timeTemp = temp?.list[i]?.main?.temp ?? 0;
        tempArray.push(Math.ceil(timeTemp));

        const timeicon = temp?.list[i]?.weather[0]?.main ?? '';
        iconArray.push(GetWeatherIcon(timeicon));
      }
    }

    setForecastTime(timeArray);
    setForecastTemp(tempArray);
    setForecastIcon(iconArray);
  }, [temp]);

  // 날씨에 따른 아이콘 설정
  const condition = data?.weather?.[0]?.main ?? '';
  const iconPath = GetWeatherIcon(condition);

  // 날씨표기
  const conditionDescription = data?.weather?.[0]?.description ?? '';
  const description = GetWeatherCondition(conditionDescription);

  const locationTempNum = useMemo<number | undefined>(() => {
    const v = data?.main?.temp;
    return typeof v === 'number' && Number.isFinite(v)
      ? Math.ceil(v)
      : undefined;
  }, [data?.main?.temp]);

  useEffect(() => {
    setCurrentTemp(locationTempNum);
  }, [locationTempNum, setCurrentTemp]);

  // 기존 표시용: 숫자 or '현재 온도' (UI는 그대로 유지)
  const locationTemp = Math.ceil(data?.main?.temp ?? 0) || '현재 온도';

  return (
    <>
      {/* 현재 온도 및 간략한 날씨정보란 */}
      <div className="flex place-content-between my-7">
        <div className="text-5xl font-bold">
          {locationTemp ? `${locationTemp}°C` : '온도 불러오는 중'}
        </div>
        <div>
          <p className="flex">
            <Image
              src={iconPath}
              alt={String(description)}
              width={22}
              height={22}
            />
            {description}
          </p>
          <p>
            최저 {minTemp}°C 최고 {maxTemp}°C
          </p>
        </div>
      </div>
      {/* 시간대별 날씨 */}
      <div
        className="flex overflow-x-auto gap-5 min-w-full scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <div className="flex flex-row overscroll-contain">
          <div className="flex flex-col items-center">
            <p className="text-sm whitespace-nowrap">지금</p>
            <p>{locationTemp}°C</p>
            <Image
              src={iconPath}
              alt={String(description)}
              width={22}
              height={22}
            />
          </div>
        </div>
        {forecastTime.map((hour, i) => (
          <div key={hour} className="flex flex-col items-center">
            <p className="text-sm whitespace-nowrap">{hour}시</p>
            <p>{forecastTemp[i]}°C</p>
            <Image
              src={forecastIcon[i]}
              alt={String(description)}
              width={22}
              height={22}
            />
          </div>
        ))}
      </div>
    </>
  );
}
