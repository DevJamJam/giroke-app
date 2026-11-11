import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TodayPage from "./page";

describe("TodayPage", () => {
  it("오늘 제목을 렌더링한다", () => {
    render(<TodayPage />);
    expect(screen.getByRole("heading", { name: "오늘" })).toBeDefined();
  });
});
