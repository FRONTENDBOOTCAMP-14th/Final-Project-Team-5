// 날씨 키워드별 아이콘 매칭시키기
export default function GetWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case 'claer':
      return '/weather/sunny.svg';
    case 'clouds':
      return '/weather/cloudy.svg';
    case 'rain':
      return '/weather/rain.svg';
    case 'snow':
      return '/weather/snow.svg';
    case 'thunderstorm':
      return '/weather/thunder.svg';
    default:
      return 'weather/rainbow.svg';
  }
}

// 날씨 키워드 매칭시키기
export function GetWeatherCondition(conditionDescription: string) {
  const d = conditionDescription.trim();
  const e = conditionDescription.toLowerCase();

  if (d.includes('흐림') || d.includes('구름') || e.includes('clouds'))
    return '흐림';
  if (d.includes('번개') || d.includes('뇌우') || e.includes('thunderstorm'))
    return '번개';
  if (d.includes('비') || e.includes('rain')) return '비';
  if (d.includes('눈') || e.includes('snow')) return '눈';
  if (d.includes('맑은') || d.includes('맑음') || e.includes('sunny'))
    return '맑음';
}
