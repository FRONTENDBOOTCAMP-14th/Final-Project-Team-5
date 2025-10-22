// 현재 위치명 한국어로 변경 및 '동' 주소까지 불러오기

export default async function GetLocation(
  lat: number | undefined,
  lon: number | undefined
) {
  const dong = await fetch(`/api/location?lat=${lat}&lon=${lon}`);
  if (!dong.ok) throw new Error('동을 불러오지 못했습니다!');
  const dongData = await dong.json();

  return dongData;
}
