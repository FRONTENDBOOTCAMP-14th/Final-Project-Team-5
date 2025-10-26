'use client';

// 현재위치 컴포넌트별 공유하기

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { LocationData } from '@/@types/global.d.ts';
import useGeoLocation from '@/hooks/useGeoLocation';
import GetLocation from '@/libs/getLocation';
import { useWeatherStore } from '@/libs/store/weatherStore';

export default function useLocationName() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationName, setLocationName] = useState<string | undefined>('');

  // 스토어에서 저장된 위치 가져오기
  const currentLat = useWeatherStore((state) => state.currentLat);
  const currentLon = useWeatherStore((state) => state.currentLon);
  const selectedLocation = useWeatherStore((state) => state.selectedLocation);

  // 현재 위치 가져오기
  const { lat: gpsLat, lon: gpsLon } = useGeoLocation();

  // 스토어 위치 우선, 없으면 현재 위치 사용
  const lat = currentLat ?? gpsLat;
  const lon = currentLon ?? gpsLon;

  // 현재 위치명 한국어로 변경
  async function GetLocationData(lat: number, lon: number) {
    try {
      const location = await GetLocation(lat, lon);
      setLocationData(location);
    } catch (error) {
      console.error(error);
      toast.error('현재 위치를 한국어로 불러오지 못했습니다!');
    }
  }

  useEffect(() => {
    if (!lat || !lon) return;
    void GetLocationData(lat, lon);
  }, [lat, lon]);

  useEffect(() => {
    // 스토어에 저장된 주소가 있으면 그것을 우선 사용
    if (selectedLocation) {
      setLocationName(selectedLocation);
      return;
    }

    // 없으면 API로 가져온 위치 데이터 사용
    if (!locationData) return;

    const area1 = locationData.results?.[0]?.region?.area1?.name || '';
    const area2 = locationData.results?.[0]?.region?.area2?.name || '';
    const area3 = locationData.results?.[0]?.region?.area3?.name || '';

    const name = `${area1} ${area2} ${area3}` || '현재 위치';

    setLocationName(name);
  }, [locationData, selectedLocation]);

  return { locationName, GetLocationData };
}
