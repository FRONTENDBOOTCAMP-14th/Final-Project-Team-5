const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const FORECAST_BASE_URL = process.env.NEXT_PUBLIC_API_FORECAST_URL;

// 현재 위치 기반 날씨 가져오기
export default async function GetWeather(
  lat: number | undefined,
  lon: number | undefined
) {
  const URL = `${BASE_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  if (!URL || !API_KEY) {
    throw new Error('API 설정이 올바르지 않습니다!');
  }

  const response = await fetch(URL);
  const responseData = await response.json();

  if (!response.ok) throw new Error('위치 데이터를 가져오지 못했습니다!');

  return responseData;
}

// 예측 일기예보 데이터 불러오기
export async function GetWeatherForecast(
  lat: number | undefined,
  lon: number | undefined
) {
  const URL = `${FORECAST_BASE_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  if (!URL || !API_KEY) {
    throw new Error('API 설정이 올바르지 않습니다!');
  }

  const forecastRes = await fetch(URL);
  const forecastResData = await forecastRes.json();

  if (!forecastRes.ok) throw new Error('일기예보 정보를 불러오지 못했습니다!');

  return forecastResData;
}
