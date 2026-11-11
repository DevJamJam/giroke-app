import { AppNav } from "@/components/app-nav";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <AppNav />
      {/* pb-22 = 하단 탭 높이(h-16) + 여백: 마지막 내용이 탭에 가리지 않게 */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-22 lg:pb-6">{children}</main>
    </div>
  );
}
