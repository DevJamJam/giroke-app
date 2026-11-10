export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

// 첫 페인트 전 inline script로도 직렬화(toString)되므로 바깥 식별자를 참조하지 않는다.
export function applyTheme() {
  let pref: string | null = null;
  try {
    pref = localStorage.getItem("theme");
  } catch {
    // 저장소가 막힌 환경(시크릿 모드 등)은 system으로 처리
  }
  const dark =
    pref === "dark" ||
    (pref !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

// <head>에서 렌더 전에 실행해 테마 깜빡임을 막고, system 선택 시 OS 변경을 따라간다.
export const themeScript = `try{(${applyTheme})();matchMedia("(prefers-color-scheme: dark)").addEventListener("change",${applyTheme})}catch(e){}`;
