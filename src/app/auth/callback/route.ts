import { NextResponse } from 'next/server';
import { CreateClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await CreateClient();
    await supabase.auth.exchangeCodeForSession(code);

    // 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // profiles에서 gender 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('gender, username')
        .eq('id', user.id)
        .single();

      // gender와 username이 있으면 메인으로, 없으면 setup으로
      if (profile?.gender && profile?.username) {
        return NextResponse.redirect(`${requestUrl.origin}/main/cloth`);
      }
      return NextResponse.redirect(`${requestUrl.origin}/auth/setup`);
    }
  }

  // 기본은 랜딩으로
  return NextResponse.redirect(requestUrl.origin);
}
