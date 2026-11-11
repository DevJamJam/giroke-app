import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppNav } from "./app-nav";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

function currentTab() {
  return screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page")
    .map((link) => link.textContent);
}

describe("AppNav", () => {
  afterEach(cleanup);

  it("1차 출시 4탭을 순서대로 보여준다", () => {
    render(<AppNav />);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "오늘",
      "캘린더",
      "기록",
      "마이",
    ]);
  });

  it.each([
    ["/", "오늘"],
    ["/calendar", "캘린더"],
    ["/records/stats", "기록"],
    ["/my", "마이"],
  ])("%s 에서는 %s 탭만 현재 페이지로 표시한다", (path, tab) => {
    pathname.current = path;
    render(<AppNav />);
    expect(currentTab()).toEqual([tab]);
  });

  it("이름이 탭 경로로 시작하기만 하는 경로는 활성으로 보지 않는다", () => {
    pathname.current = "/mystery";
    render(<AppNav />);
    expect(currentTab()).toEqual([]);
  });
});
