import { ArrowLeft } from 'lucide-react';
import { Frame, WeatherDashboard, WeatherWeekly } from '@/components';

export default function WeatherDetails() {
  return (
    <Frame>
      <ArrowLeft className="ml-11 mt-20 mb-4 mx-auto" />
      <WeatherDashboard />
      <WeatherWeekly />
    </Frame>
  );
}
