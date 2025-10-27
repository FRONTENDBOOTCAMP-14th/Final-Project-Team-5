'use client';

import React from 'react';

type FrameProps = React.PropsWithChildren<{
  className?: string;
  paddingX?: number; // 좌우 패딩(px)
  paddingTopY?: number; // 상단 패딩(px)
  color?: string; // 그라데이션 시작 색
}>;

export default function Frame({
  children,
  className = '',
  paddingX,
  paddingTopY,
  color,
}: FrameProps) {
  const hasPaddingX = typeof paddingX === 'number' && paddingX > 0;
  const hasPaddingTop = typeof paddingTopY === 'number' && paddingTopY > 0;
  const hasColor = typeof color === 'string' && color.length > 0;

  const [isMobile, setIsMobile] = React.useState(false);

  // 브라우저 크기 감지
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // 초기 실행
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasFooter = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type as { $$frameFooter?: boolean }).$$frameFooter === true
  );

  return (
    <div
      className={[
        'fixed left-1/2 top-0 -translate-x-1/2',
        isMobile ? 'w-full max-w-full' : 'w-[460px] max-w-[460px]',
        'h-dvh max-h-dvh shadow-[0px_0px_16px_0px_rgba(0,0,0,0.08)]',
        className,
      ].join(' ')}
      style={{
        background: hasColor
          ? `linear-gradient(to bottom, ${color} 0%, #ffffff 100%)`
          : undefined,
      }}
    >
      <div
        className={`h-full overflow-y-auto overscroll-contain ${
          hasFooter ? 'pb-[82px]' : 'pb-0'
        }`}
        style={{
          paddingLeft: hasPaddingX ? `${paddingX}px` : undefined,
          paddingRight: hasPaddingX ? `${paddingX}px` : undefined,
          paddingTop: hasPaddingTop ? `${paddingTopY}px` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
