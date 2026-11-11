import { ThemeSelect } from "@/components/theme-select";

export const metadata = { title: "마이" };

export default function MyPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">마이</h1>
      <ThemeSelect />
    </div>
  );
}
