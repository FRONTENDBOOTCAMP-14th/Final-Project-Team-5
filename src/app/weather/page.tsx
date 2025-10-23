import {
  Frame,
  WeatherDashboard,
  WeatherWeekly,
  BackButton,
} from '@/components';

export default function WeatherDetails() {
  return (
    <Frame>
      <BackButton />
      <WeatherDashboard />
      <WeatherWeekly />
    </Frame>
  );
}
