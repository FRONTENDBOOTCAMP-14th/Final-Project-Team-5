'use client';
import React from 'react';

export default function DraggableCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const state = React.useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [grabbing, setGrabbing] = React.useState(false);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current) return;
    containerRef.current.setPointerCapture(e.pointerId);
    state.current.isDown = true;
    setGrabbing(true);
    state.current.startX = e.clientX;
    state.current.scrollLeft = containerRef.current.scrollLeft;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current || !state.current.isDown) return;
    const dx = e.clientX - state.current.startX;
    containerRef.current.scrollLeft = state.current.scrollLeft - dx;
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    state.current.isDown = false;
    setGrabbing(false);
    if (e && containerRef.current) {
      try { containerRef.current.releasePointerCapture(e.pointerId); } catch {}
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const idx = 1;
    if (!container || !track || !track.children[idx]) return;

    const card = track.children[idx] as HTMLElement;
    const containerCenter = container.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const target = Math.max(0, cardCenter - containerCenter);

    container.scrollTo({ left: target, behavior: 'auto' });
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      const idx = 1;
      if (!container || !track || !track.children[idx]) return;
      const card = track.children[idx] as HTMLElement;
      const containerCenter = container.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const target = Math.max(0, cardCenter - containerCenter);
      container.scrollTo({ left: target, behavior: 'auto' });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={[
          'mx-auto max-w-full overflow-x-auto overflow-y-hidden',
          'scroll-smooth snap-x snap-mandatory',
          'select-none',
          grabbing ? 'cursor-grabbing' : 'cursor-grab',
          '[&::-webkit-scrollbar]:hidden scrollbar-none',
        ].join(' ')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div ref={trackRef} className="flex gap-[25px] px-4 py-2">
          <div className="snap-center shrink-0 w-[258px] h-[258px] rounded-2xl bg-[#388BFE] flex items-center justify-center text-white font-bold text-[18px]">
            이미지 1
          </div>
          <div className="snap-center shrink-0 w-[258px] h-[258px] rounded-2xl bg-[#FF7F50] flex items-center justify-center text-white font-bold text-[18px]">
            이미지 2
          </div>
          <div className="snap-center shrink-0 w-[258px] h-[258px] rounded-2xl bg-[#6CC24A] flex items-center justify-center text-white font-bold text-[18px]">
            이미지 3
          </div>
        </div>
      </div>
    </div>
  );
}
