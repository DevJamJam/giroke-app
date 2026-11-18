import { redirect } from "next/navigation";
import { Suspense } from "react";

import { VerifyForm } from "./verify-form";

export const metadata = { title: "가입 인증" };

// Cache Components: searchParams는 요청 때만 알 수 있어 Suspense 안에서 읽는다
async function VerifyContent({ searchParams }: Pick<PageProps<"/verify">, "searchParams">) {
  const { email } = await searchParams;
  if (typeof email !== "string" || !email) redirect("/signup");
  return <VerifyForm email={email} />;
}

export default function VerifyPage({ searchParams }: PageProps<"/verify">) {
  return (
    <Suspense fallback={null}>
      <VerifyContent searchParams={searchParams} />
    </Suspense>
  );
}
