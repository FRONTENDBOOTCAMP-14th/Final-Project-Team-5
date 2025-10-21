import { NextResponse } from 'next/server';

const SEARCH_BASE_URL = process.env.NEXT_PUBLIC_SEARCH_LOCATION_API_URL;
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_SEARCH_LOCATION_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  // const lat = searchParams.get('y');
  // const lon = searchParams.get('x');

  if (!query) {
    return NextResponse.json({ error: 'error.message' }, { status: 400 });
  }

  const LOCATION_URL = `${SEARCH_BASE_URL}query=${encodeURIComponent(query)}&page=3`;

  const res = await fetch(LOCATION_URL, {
    method: 'GET',
    headers: {
      Authorization: SEARCH_API_KEY as string,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
