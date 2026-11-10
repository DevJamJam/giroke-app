import { ThemeSelect } from "@/components/theme-select";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold">기록해요</h1>
      <p className="text-foreground-muted">오늘을 기록해요</p>
      <ThemeSelect />
    </main>
  );
}
