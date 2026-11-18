import { Card } from "@/components/ui/card";

// 로그인 전 화면: 탭 없이 가운데 카드 하나
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <p className="text-center text-xl font-semibold text-primary">기록해요</p>
        <Card className="flex flex-col gap-5 p-6">{children}</Card>
      </div>
    </main>
  );
}
