'use client';

import React from 'react';
import ImageList from '@/components/ui/ImageList';

export type MainCarouselItem = {
  id: string;
  image: string;
  title?: string;
  sub?: string;
};

export default function MainCarousel({
  items,
  onItemClick,
}: {
  items: MainCarouselItem[];
  onItemClick?: (id: string) => void; // 클릭 시 모달 콜백
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // 데스크톱(마우스) 드래그 상태
  const draggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);
  const mouseMovedRef = React.useRef(false);
  const [grabbing, setGrabbing] = React.useState(false);

  const CLICK_THRESHOLD = 6; // px

  React.useEffect(() => {
    const el = containerRef.current;
    const idx = 1;
    const card = trackRef.current?.children?.[idx] as HTMLElement | undefined;
    if (!el || !card) return;
    const containerCenter = el.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, cardCenter - containerCenter), behavior: 'auto' });
  }, [items.length]);

  // ===== 데스크톱 전용 마우스 드래그 구현 (pointer capture 사용 X) =====
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // 스크롤 영역 위에서만 동작
      draggingRef.current = true;
      mouseMovedRef.current = false;
      startXRef.current = e.clientX;
      startScrollLeftRef.current = el.scrollLeft;
      setGrabbing(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > CLICK_THRESHOLD) mouseMovedRef.current = true;
      el.scrollLeft = startScrollLeftRef.current - dx;
      e.preventDefault(); // 텍스트 선택 방지
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      setGrabbing(false);
    };

    // 컨테이너에 mousedown, 전역에 move/up — 클릭 이벤트는 그대로 살아있음
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleCardClick = (id: string) => {
    // 드래그로 움직였으면 클릭 무시(데스크톱 전용 가드)
    if (mouseMovedRef.current) return;
    onItemClick?.(id);
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={[
          'mx-auto max-w-full overflow-x-auto overflow-y-hidden',
          'scroll-smooth snap-x snap-mandatory',
          'select-none touch-pan-x',              // 모바일: 가로 스와이프 네이티브
          '[&::-webkit-scrollbar]:hidden scrollbar-none',
          grabbing ? 'cursor-grabbing' : 'cursor-grab',
        ].join(' ')}
        // 고스트 이미지 방지
        onDragStart={(e) => e.preventDefault()}
      >
        <div ref={trackRef} className="flex gap-[25px] px-4 py-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="snap-center shrink-0 w-[258px] outline-none"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(it.id)} // 클릭 = 모달
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(it.id);
              }}
            >
              <div className="w-[258px] h-[258px] rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer">
                <ImageList src={it.image}>
                  {(it.title || it.sub) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white pointer-events-none">
                      <div className="text-[14px] font-semibold truncate">
                        {it.title ?? '게시글'}
                      </div>
                      {it.sub && (
                        <div className="text-[12px] text-gray-200 truncate">
                          {it.sub}
                        </div>
                      )}
                    </div>
                  )}
                </ImageList>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
