import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { applyTheme, themeScript } from "./theme";

function stubSystemDark(matches: boolean) {
  const addEventListener = vi.fn();
  vi.stubGlobal("matchMedia", () => ({ matches, addEventListener }));
  return addEventListener;
}

describe("applyTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([
    ["dark", false, "dark"],
    ["light", true, "light"],
    [null, true, "dark"],
    [null, false, "light"],
    ["이상한값", true, "dark"],
  ])("저장값 %s, OS 다크 %s → %s", (stored, systemDark, expected) => {
    if (stored) localStorage.setItem("theme", stored);
    stubSystemDark(systemDark);
    applyTheme();
    expect(document.documentElement.dataset.theme).toBe(expected);
  });

  it("저장소 접근이 막히면 OS 설정을 따른다", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    stubSystemDark(true);
    applyTheme();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("직렬화된 inline script가 실행되고 OS 변경을 구독한다", () => {
    localStorage.setItem("theme", "dark");
    const addEventListener = stubSystemDark(false);
    new Function(themeScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
