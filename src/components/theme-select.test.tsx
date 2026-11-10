import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSelect } from "./theme-select";

describe("ThemeSelect", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: vi.fn() }));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("저장값이 없으면 시스템 설정을 보여준다", () => {
    render(<ThemeSelect />);
    expect(screen.getByLabelText("테마")).toHaveProperty("value", "system");
  });

  it("다크를 고르면 저장하고 바로 적용한다", () => {
    render(<ThemeSelect />);
    fireEvent.change(screen.getByLabelText("테마"), { target: { value: "dark" } });
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByLabelText("테마")).toHaveProperty("value", "dark");
  });

  it("시스템 설정으로 돌아가면 저장값을 지운다", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeSelect />);
    fireEvent.change(screen.getByLabelText("테마"), { target: { value: "system" } });
    expect(localStorage.getItem("theme")).toBeNull();
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
