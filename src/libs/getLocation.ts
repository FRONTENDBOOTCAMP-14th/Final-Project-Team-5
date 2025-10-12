// 현재 위치명 한국어로 변경 및 '동' 주소까지 불러오기

// export default async function GetLocation(
//   lat: number | null,
//   lon: number | null
// ) {
//   const LOCATION_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=6&appid=${API_KEY}`;

//   if (!URL || !API_KEY) {
//     throw new Error('현재 위치를 한국어로 변경하는데 오류가 발생했습니다!');
//   }

//   const res = await fetch(LOCATION_URL);
//   if (!res.ok) throw new Error('한국어 데이터를 가져오지 못했습니다!');
//   const resData = await res.json();

//   return resData;
// }

export default async function GetLocation(
  lat: number | null,
  lon: number | null
) {
  const dong = await fetch(`/api/location?lat=${lat}&lon=${lon}`);
  if (!dong.ok) throw new Error('동을 불러오지 못했습니다!');
  const dongData = await dong.json();

  return dongData;
}
