// 주소 검색기능

export default async function LoadSearch(query: string) {
  const search = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

  if (!search.ok) throw new Error('주소 검색 서비스를 실행하지 못했습니다!');
  const searchData = await search.json();

  return searchData;
}
