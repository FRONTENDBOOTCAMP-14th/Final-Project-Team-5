import { Clock4, MapPin } from 'lucide-react';

interface WeatherSimpleBarProps {
  location: string;
  time: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function WeatherSimpleBar({
  location,
  time,
  style,
  className = '',
}: WeatherSimpleBarProps) {
  return (
    <div
      style={style}
      className={`text-black text-[12px] font-bold space-x-1 flex items-center flex-wrap ${className}`}
    >
      <span className="bg-white rounded-full px-3 py-1 flex items-center gap-1">
        <MapPin size={16} className="text-[#388BFE]" />
        {location}
      </span>
      <span>에서</span>
      <span className="bg-white rounded-full px-3 py-1 flex items-center gap-1">
        <Clock4 size={16} className="text-[#388BFE]" />
        {time}
      </span>
      <span>에 외출시</span>
    </div>
  );
}
