type FrameProps = React.PropsWithChildren<{
  className?: string;
  paddingX?: number; // 좌우 패딩(px 단위)
  color?: string;    // 그라데이션 색상 (예: "#388BFE" 또는 "rgba(56,139,254,0.5)")
}>;

export default function Frame({ children, className = '', paddingX, color }: FrameProps) {
  const hasPadding = typeof paddingX === 'number' && paddingX > 0;
  const hasColor = typeof color === 'string' && color.length > 0;

  return (
    <div
      className={`shadow-[0px_0px_16px_0px_rgba(0,0,0,0.08)] w-[460px] max-w-[460px] h-full h-screen absolute left-1/2 -translate-x-1/2 ${className}`}
      style={{
        paddingLeft: hasPadding ? `${paddingX}px` : undefined,
        paddingRight: hasPadding ? `${paddingX}px` : undefined,
        background: hasColor
          ? `linear-gradient(to bottom, ${color} 0%, #ffffff 100%)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
