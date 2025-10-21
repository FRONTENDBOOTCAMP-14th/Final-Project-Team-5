// 변경 위치의 주소 가져오기

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { LocationData } from '@/@types/global.d.ts';
import GetLocation from '@/libs/getLocation';

export default function useLocationData(lat?: number, lon?: number) {
  const [locationData, setLocationData] = useState<LocationData | null>(null);

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

  return { locationData, GetLocationData };
}
