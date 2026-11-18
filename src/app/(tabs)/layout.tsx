import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import { createClient } from "@/lib/supabase/server";

// 로그인 확인은 proxy가, 온보딩(profile 생성) 여부는 여기서 확인한다.
// Cache Components: 쿠키를 읽는 부분만 Suspense 안에 두어 나머지는 정적 shell로 먼저 보낸다
async function OnboardingGate() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id").maybeSingle();
  if (!data) redirect("/onboarding");
  return null;
}

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Suspense fallback={null}>
        <OnboardingGate />
      </Suspense>
      <AppNav />
      {/* pb-22 = 하단 탭 높이(h-16) + 여백: 마지막 내용이 탭에 가리지 않게 */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-22 lg:pb-6">{children}</main>
    </div>
  );
}
