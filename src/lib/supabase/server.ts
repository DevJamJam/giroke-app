import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

// 서버 컴포넌트용: 인증 확인·초기 조회만 한다(R-18). 쿠키 갱신은 proxy가 맡는다.
export async function createClient() {
  // 요청 시점에만 만든다: supabase 클라이언트가 생성 시 현재 시각을 읽어 prerender 중이면 경고가 난다
  await connection();
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없다. proxy가 매 요청 갱신한다.
          }
        },
      },
    },
  );
}
