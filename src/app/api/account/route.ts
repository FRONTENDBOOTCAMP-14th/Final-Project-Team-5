import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 환경변수 체크
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: '서버 설정 오류: 환경변수가 없습니다.' },
        { status: 500 }
      );
    }

    // Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // profiles 테이블에서 삭제
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('profiles 삭제 에러:', profileError);
      throw profileError;
    }

    // auth.users에서 삭제
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('auth.users 삭제 에러:', authError);
      throw authError;
    }

    return NextResponse.json({
      success: true,
      message: '회원탈퇴가 완료되었습니다.',
    });
  } catch (error: unknown) {
    console.error('회원탈퇴 API 에러:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : '회원탈퇴 중 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
