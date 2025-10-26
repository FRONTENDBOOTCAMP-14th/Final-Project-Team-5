import {
  Frame,
  WeatherDashboard,
  WeatherWeekly,
  BackButton,
} from '@/components';

export default function WeatherDetails() {
  return (
    <Frame paddingX={24}>
      <BackButton />
      <WeatherDashboard />
      <WeatherWeekly />
    </Frame>
  );
}
