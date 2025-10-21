'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, MapPin, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import type { Document } from '@/@types/global';
import useGeoLocation from '@/hooks/useGeoLocation';
import useLocationData from '@/hooks/useLocationData';
import LoadSearch from '@/libs/loadSearch';
import Button from './Button';
import Input from './Input';
import LocationTemp from './LocationTemp';
import Modal from './Modal';

export default function WeatherDashboard() {
  const [locationName, setLocationName] = useState<string | undefined>('');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Document | null>(null);
  const [isSelect, setIsSelect] = useState<number | null>(null);

  // 현재 위치 가져오기
  const { lat, lon } = useGeoLocation();

  // 위치 변경시 주소 변경되게하기
  const { locationData, GetLocationData } = useLocationData(lat, lon);

  useEffect(() => {
    if (!locationData) return;

    const area1 = locationData.results?.[0]?.region?.area1?.name || '';
    const area2 = locationData.results?.[0]?.region?.area2?.name || '';
    const area3 = locationData.results?.[0]?.region?.area3?.name || '';

    const name = `${area1} ${area2} ${area3}` || '현재 위치';
    setLocationName(name);
  }, [locationData]);

  const pathName = usePathname();

  // 창 닫기
  function handleClose() {
    setIsOpen(false);
  }

  // 주소 검색하기
  async function handleSearch() {
    if (!query) return;
    try {
      const searchTerm = (await LoadSearch(query)) as Document;
      setResults(searchTerm);
    } catch (error) {
      console.log(error);
      toast.error('주소 검색창을 불러오지 못했습니다!');
    }
  }

  return (
    <div className="h-[228px] p-3 rounded-2xl ml-11 mr-11 mx-auto bg-[#FFFFFF]">
      {/* 위치 및 더보기 버튼 */}
      <div className="flex place-content-between">
        {/* 현재위치 클릭시 내 위치선택 모달창 연결 */}
        <button
          type="button"
          className="flex gap-[1px] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <MapPin />
          {locationName}
        </button>
        {/* 모달창 */}
        {isOpen && (
          <Modal
            onClose={() => {
              setIsOpen(false);
              setQuery('');
              setResults(null);
            }}
          >
            <div className="relative">
              <Input
                id="address"
                label=""
                value={query}
                placeholder="예) 도로명 주소로 검색해보세요 (예: 반포대로 58)"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSearch();
                }}
                className="mb-4"
              />
              <button
                type="reset"
                className="absolute cursor-pointer right-10 top-4"
                onClick={() => {
                  setQuery('');
                  setResults(null);
                }}
              >
                <X size={16} aria-label="검색어 삭제" />
              </button>
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-4"
                onClick={() => void handleSearch()}
              >
                <Search aria-label="검색하기" />
              </button>
            </div>

            {/* 결과표시 */}
            <table className="w-full ">
              <tbody>
                <tr className="gap-6">
                  <th className="text-left py-2">우편번호</th>
                  <th className="text-left py-2">도로명 주소</th>
                  <th className="text-left py-2">선택여부</th>
                </tr>
                {results?.documents?.map((doc, index) => (
                  <tr
                    key={index}
                    tabIndex={0}
                    className={`h-[44px] px-1 ${
                      results?.documents?.length
                        ? 'hover:bg-[#EBF3FE] cursor-pointer'
                        : ''
                    }`}
                  >
                    <td className="py-2">
                      {results?.documents?.[0]?.road_address?.zone_no && (
                        <>({results.documents[0].road_address.zone_no})</>
                      )}
                    </td>
                    <td className="py-2">
                      {results?.documents?.[0]?.address_name}
                      {results?.documents?.[0]?.road_address?.building_name && (
                        <>({results.documents[0].road_address.building_name})</>
                      )}
                    </td>
                    <td className="text-center items-center">
                      <input
                        type="checkbox"
                        className="border-[1px] w-5 h-5"
                        checked={isSelect === index}
                        onChange={() =>
                          setIsSelect(isSelect === index ? null : index)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button
              type="button"
              className="mb-auto mt-4 cursor-pointer"
              onClick={() => {
                if (isSelect !== null) {
                  const selected = results?.documents[isSelect];
                  const addressLat = Number(selected?.y);
                  const addressLon = Number(selected?.x);

                  void GetLocationData(addressLat, addressLon);
                  handleClose();
                } else {
                  toast('주소를 선택해주세요!');
                }
                setQuery('');
                setResults(null);
              }}
            >
              변경
            </Button>
          </Modal>
        )}
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
