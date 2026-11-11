import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "./button";
import { Input } from "./input";

afterEach(cleanup);

describe("Button", () => {
  it("기본 type은 button이라 form 안에서 실수로 제출하지 않는다", () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" }).getAttribute("type")).toBe("button");
  });

  it("disabled면 클릭이 실행되지 않는다", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        저장
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Input", () => {
  it("label로 input을 찾을 수 있고 안내 문구가 연결된다", () => {
    render(<Input label="제목" hint="20자 이내" />);
    const input = screen.getByLabelText("제목");
    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe(
      "20자 이내",
    );
  });

  it("오류가 있으면 aria-invalid와 오류 문구를 안내 대신 연결한다", () => {
    render(<Input label="제목" hint="20자 이내" error="제목을 입력해 주세요" />);
    const input = screen.getByLabelText("제목");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe(
      "제목을 입력해 주세요",
    );
    expect(screen.queryByText("20자 이내")).toBeNull();
  });
});
