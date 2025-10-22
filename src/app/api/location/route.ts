import { NextResponse } from 'next/server';

const REVERSE_BASE_URL = process.env.NEXT_PUBLIC_API_REVERSE_BASE_URL;
const REVERSE_API_KEY_ID = process.env.NEXT_PUBLIC_REVERSE_API_KEY_ID;
const REVERSE_API_KEY = process.env.NEXT_PUBLIC_REVERSE_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'error.message' }, { status: 400 });
  }

  const REVERSE_URL = `${REVERSE_BASE_URL}coords=${lon},${lat}&orders=legalcode&output=json`;

  const res = await fetch(REVERSE_URL, {
    method: 'GET',
    headers: {
      'x-ncp-apigw-api-key-id': REVERSE_API_KEY_ID as string,
      'x-ncp-apigw-api-key': REVERSE_API_KEY as string,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
