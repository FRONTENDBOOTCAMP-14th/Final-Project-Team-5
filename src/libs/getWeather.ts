// 현재 위치 기반 날씨 가져오기

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default async function GetWeather(
  lat: number | null,
  lon: number | null
) {
  const URL = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  if (!URL || !API_KEY) {
    throw new Error('API 설정이 올바르지 않습니다!');
  }

  const response = await fetch(URL);
  const responseData = await response.json();

  if (!response.ok) throw new Error('위치 데이터를 가져오지 못했습니다!');

  return responseData;
}
