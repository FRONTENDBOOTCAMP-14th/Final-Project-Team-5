'use client';

import { useState, useDeferredValue } from 'react';
import { ChevronRight, MapPin, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import type { Document } from '@/@types/global';
import useLocationName from '@/hooks/useLocationName';
import LoadSearch from '@/libs/loadSearch';
import { useWeatherStore } from '@/libs/store/weatherStore';
import Button from './Button';
import Input from './Input';
import LocationTemp from './LocationTemp';
import Modal from './Modal';
import Spinner from './Spinner';

export default function WeatherDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Document | null>(null);
  const [isSelect, setIsSelect] = useState<number | null>(null);

  // 현재 위치 가져오기
  const { locationName, GetLocationData } = useLocationName();

  const pathName = usePathname();

  // 창 닫기
  function handleClose() {
    setIsOpen(false);
  }

  // 주소 검색하기
  async function handleSearch(searchQuery: string) {
    if (!searchQuery) return;
    try {
      const searchTerm = (await LoadSearch(searchQuery)) as Document;
      setResults(searchTerm);
    } catch (error) {
      console.error(error);
      toast.error('주소 검색창을 불러오지 못했습니다!');
    }
  }

  const setLocation = useWeatherStore((state) => state.setLocation);

  // 성능향상을 위한 input 검색어 useDeferredValue 훅 적용
  const deferredQuery = useDeferredValue(query);

  // 로딩스피너
  if (!locationName) {
    return (
      <div className="h-[228px] p-3 rounded-2xl mx-auto bg-[#FFFFFF] flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="h-[228px] p-3 rounded-2xl mx-auto bg-[#FFFFFF]">
      {/* 위치 및 더보기 버튼 */}
      <div className="flex place-content-between">
        {/* 현재위치 클릭시 내 위치선택 모달창 연결 */}
        <button
          type="button"
          className="flex gap-[1px] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <MapPin />
          <p className="text-nowrap">
            {locationName ? `${locationName}` : '위치 불러오는 중'}
          </p>
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
                  if (e.key === 'Enter') {
                    if (query.length === 0) {
                      toast.warning('주소를 입력해주세요!');
                    } else if (results?.documents?.length === 0) {
                      toast.warning('일치하는 검색결과가 없습니다!');
                    }
                  }
                  void handleSearch(deferredQuery);
                }}
                className="mb-4"
              />
              <button
                type="reset"
                className="absolute cursor-pointer right-9 top-6"
                onClick={() => {
                  setQuery('');
                  setResults(null);
                }}
              >
                <X size={16} aria-label="검색어 삭제" />
              </button>
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-5"
                onClick={() => {
                  if (query.length === 0) {
                    toast.warning('주소를 입력해주세요!');
                  } else if (results?.documents?.length === 0) {
                    toast.warning('일치하는 검색결과가 없습니다!');
                  }
                  void handleSearch(deferredQuery);
                }}
              >
                <Search aria-label="검색하기" />
              </button>
            </div>

            {/* 결과표시 */}
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <tbody>
                  <tr className="gap-6">
                    <th className="text-left text-nowrap py-2">우편번호</th>
                    <th className="text-left text-nowrap py-4">도로명 주소</th>
                    <th className="text-left text-nowrap py-2">선택여부</th>
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
                          <>({results?.documents?.[0]?.road_address.zone_no})</>
                        )}
                      </td>
                      <td className="py-4">
                        {results?.documents?.[0]?.address_name}
                        {results?.documents?.[0]?.road_address
                          ?.building_name && (
                          <>
                            (
                            {
                              results?.documents?.[0]?.road_address
                                .building_name
                            }
                            )
                          </>
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
            </div>

            <Button
              type="button"
              className="mb-auto mt-10 cursor-pointer"
              onClick={() => {
                if (isSelect !== null) {
                  const selected = results?.documents[isSelect];
                  const addressLat = Number(selected?.y);
                  const addressLon = Number(selected?.x);
                  const address = String(selected?.address_name);

                  void GetLocationData(addressLat, addressLon);
                  setLocation(addressLat, addressLon, address);
                  handleClose();
                } else {
                  toast('주소를 선택해주세요!');
                }
                setQuery('');
                setResults(null);
                setIsSelect(null);
              }}
            >
              변경
            </Button>
          </Modal>
        )}
        {/* 더보기 클릭시 현재위치 날씨 및 일주일 기상정보 페이지로 이동 */}
        {pathName !== '/weather' && (
          <Link href="/weather" className="flex text-nowrap">
            더보기
            <ChevronRight />
          </Link>
        )}
      </div>
      <LocationTemp />
    </div>
  );
}
