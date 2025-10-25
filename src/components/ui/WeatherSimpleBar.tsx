import { Clock4, MapPin } from 'lucide-react';
import useLocationName from '@/hooks/useLocationName';

interface WeatherSimpleBarProps {
  time: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function WeatherSimpleBar({
  style,
  className = '',
}: WeatherSimpleBarProps) {
  // 현재 위치 구하기
  const { locationName } = useLocationName();

  // 현재 시간 구하기
  const now = new Date();
  const hour = now.getHours();

  return (
    <div
      style={style}
      className={`text-black text-[12px] font-bold space-x-1 flex items-center flex-wrap ${className}`}
    >
      <span className="bg-white rounded-full px-3 py-1 flex items-center gap-1">
        <MapPin size={16} className="text-[#388BFE]" />
        {locationName}
      </span>
      <span>에서</span>
      <span className="bg-white rounded-full px-3 py-1 flex items-center gap-1">
        <Clock4 size={16} className="text-[#388BFE]" />
        {hour}시
      </span>
      <span>부터 외출시</span>
    </div>
  );
}
