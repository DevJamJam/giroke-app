import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;

// 브라우저용: 세션은 쿠키에 저장되어 proxy·서버 컴포넌트와 공유된다.
// 처음 호출할 때 만든다: 모듈을 불러오기만 해도 만들면 서버 prerender 중에 세션 타이머가 돈다
export function getSupabase() {
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return client;
}
