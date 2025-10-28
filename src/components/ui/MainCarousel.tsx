'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import ImageList from '@/components/ui/ImageList';

export interface MainCarouselItem {
  id: string;
  image: string;
  title?: string;
  sub?: string;
}

export default function MainCarousel({
  items,
  onItemClick,
  bookmarkedSet,
  onToggleBookmark,
}: {
  items: MainCarouselItem[];
  onItemClick?: (id: string) => void;
  bookmarkedSet?: Set<string>;
  onToggleBookmark?: (id: string) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const draggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);
  const mouseMovedRef = React.useRef(false);
  const [grabbing, setGrabbing] = React.useState(false);

  const CLICK_THRESHOLD = 6;

  React.useEffect(() => {
    const el = containerRef.current;
    const idx = 2;
    const card = trackRef.current?.children?.[idx] as HTMLElement | undefined;
    if (!el || !card) return;
    const containerCenter = el.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    el.scrollTo({
      left: Math.max(0, cardCenter - containerCenter),
      behavior: 'auto',
    });
  }, [items.length]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
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
      e.preventDefault();
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      setGrabbing(false);
    };

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
          'select-none touch-pan-x',
          '[&::-webkit-scrollbar]:hidden scrollbar-none',
          grabbing ? 'cursor-grabbing' : 'cursor-grab',
        ].join(' ')}
        onDragStart={(e) => e.preventDefault()}
      >
        <div ref={trackRef} className="flex gap-[25px] px-4 py-2">
          {items.map((it) => {
            const on = bookmarkedSet?.has(it.id) ?? false;
            const hasText = Boolean(it.title || it.sub);
            return (
              <div
                key={it.id}
                className="snap-center shrink-0 w-[258px] outline-none"
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(it.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(it.id);
                }}
              >
                <div className="relative w-[258px] h-[258px] rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer">
                  <ImageList src={it.image}>
                    <div
                      className={[
                        'absolute bottom-0 left-0 right-0 pr-[35px] p-2 pointer-events-none',
                        'h-[54px] flex flex-col justify-center',
                        hasText ? 'bg-black/40 text-white' : 'bg-transparent',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'text-[14px] font-semibold truncate',
                          it.title ? 'opacity-100' : 'opacity-0',
                        ].join(' ')}
                      >
                        {it.title ?? ''}
                      </div>
                      <div
                        className={[
                          'text-[12px] text-gray-200 truncate',
                          it.sub ? 'opacity-100' : 'opacity-0',
                        ].join(' ')}
                      >
                        {it.sub ?? ''}
                      </div>
                    </div>
                  </ImageList>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      mouseMovedRef.current = false;
                      onToggleBookmark?.(it.id);
                    }}
                    className="absolute bottom-2 right-2 rounded-full bg-white/80 backdrop-blur-[2px] p-1 shadow"
                    aria-label={on ? '북마크 해제' : '북마크 등록'}
                    title={on ? '북마크 해제' : '북마크 등록'}
                  >
                    <Heart
                      className={
                        on ? 'w-5 h-5 text-red-500' : 'w-5 h-5 text-gray-700'
                      }
                      fill={on ? 'currentColor' : 'transparent'}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
