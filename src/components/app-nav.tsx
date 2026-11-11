"use client";

import { CalendarDays, CircleUser, NotebookPen, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 1차 출시 4탭 (기획서 5장). 친구 탭은 2차 Phase 7에서 추가
const TABS = [
  { href: "/", label: "오늘", icon: Sun },
  { href: "/calendar", label: "캘린더", icon: CalendarDays },
  { href: "/records", label: "기록", icon: NotebookPen },
  { href: "/my", label: "마이", icon: CircleUser },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// <1024px 하단 탭, ≥1024px 좌측 Navigation (lg = 1024px)
export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-56 lg:shrink-0 lg:border-t-0 lg:border-r"
    >
      <ul className="flex lg:flex-col lg:gap-1 lg:p-3">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-xs lg:h-auto lg:flex-row lg:justify-start lg:gap-3 lg:rounded-md lg:px-3 lg:py-2.5 lg:text-sm ${
                  active ? "font-semibold text-primary lg:bg-primary-soft" : "text-foreground-muted"
                }`}
              >
                <Icon aria-hidden size={22} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
