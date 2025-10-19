'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import type { LocationData } from '@/@types/global.d.ts';
import useGeoLocation from '@/hooks/useGeoLocation';
import GetLocation from '@/libs/getLocation';
import LocationTemp from './LocationTemp';

export default function WeatherDashboard() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationName, setLocationName] = useState<string | undefined>('');

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();

  useEffect(() => {
    if (!lat || !lon) return;

    const abortController = new AbortController();

    // 현재 위치명 한국어로 변경
    async function GetLocationData() {
      try {
        const location = await GetLocation(lat, lon);
        setLocationData(location);
      } catch (error) {
        console.error(error);
        toast.error('현재 위치를 한국어로 불러오지 못했습니다!');
      }
    }

    void GetLocationData();

    return () => {
      abortController.abort();
    };
  }, [lat, lon]);

  useEffect(() => {
    if (!locationData) return;

    const area1 = locationData.results?.[0]?.region?.area1?.name || '';
    const area2 = locationData.results?.[0]?.region?.area2?.name || '';
    const area3 = locationData.results?.[0]?.region?.area3?.name || '';

    const name = `${area1} ${area2} ${area3}` || '현재 위치';
    setLocationName(name);
  }, [locationData]);

  const pathName = usePathname();

  return (
    <div className="h-[228px] p-3 rounded-2xl ml-11 mr-11 mx-auto bg-[#FFFFFF]">
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
      <LocationTemp />
    </div>
  );
}
