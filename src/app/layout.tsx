import type { Metadata } from "next";
// 사용한 글자가 속한 묶음만 내려받는 dynamic subset (전체 파일은 2MB)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { themeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "기록해요", template: "%s · 기록해요" },
  description: "오늘을 기록해요",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme은 hydration 전에 inline script가 정하므로 불일치 경고를 끈다
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
