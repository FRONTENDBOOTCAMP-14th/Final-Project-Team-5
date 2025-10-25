// 현재위치 컴포넌트별 공유하기

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { LocationData } from '@/@types/global.d.ts';
import useGeoLocation from '@/hooks/useGeoLocation';
import GetLocation from '@/libs/getLocation';

export default function useLocationName() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationName, setLocationName] = useState<string | undefined>('');

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();

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
    if (!locationData) return;

    const area1 = locationData.results?.[0]?.region?.area1?.name || '';
    const area2 = locationData.results?.[0]?.region?.area2?.name || '';
    const area3 = locationData.results?.[0]?.region?.area3?.name || '';

    const name = `${area1} ${area2} ${area3}` || '현재 위치';

    setLocationName(name);
  }, [locationData]);

  return { locationName, GetLocationData };
}
