import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function CreateClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '환경 변수가 없습니다: NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
