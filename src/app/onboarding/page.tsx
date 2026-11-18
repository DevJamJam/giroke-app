import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "시작하기" };

// 로그인 확인은 proxy가, 이미 온보딩을 마쳤는지는 여기서 확인한다
async function AlreadyOnboardedGate() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id").maybeSingle();
  if (data) redirect("/");
  return null;
}

export default function OnboardingPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <Suspense fallback={null}>
        <AlreadyOnboardedGate />
      </Suspense>
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-border bg-surface p-6">
        <OnboardingForm />
      </div>
    </main>
  );
}
