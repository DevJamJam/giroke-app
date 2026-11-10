"use client";

import { useSyncExternalStore } from "react";

import { applyTheme, THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "시스템 설정" },
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
];

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

// shortcut: Phase 2 전까지 브라우저 저장만 사용, 설정 테이블이 생기면 서버 저장으로 옮긴다.
export function ThemeSelect() {
  const preference = useSyncExternalStore(subscribe, getPreference, () => "system");

  function handleChange(value: string) {
    try {
      if (value === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // 저장이 막히면 system으로 남는다
    }
    applyTheme();
    // 같은 탭에서는 storage 이벤트가 오지 않으므로 직접 알린다
    window.dispatchEvent(new StorageEvent("storage"));
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground-muted">
      테마
      <select
        value={preference}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-sm border border-border bg-surface px-3 py-2 text-foreground"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
