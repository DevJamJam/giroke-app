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

  it("loading이면 중복 클릭을 막고 진행 중임을 알리며 이름은 유지한다", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        저장 중
      </Button>,
    );
    const button = screen.getByRole("button", { name: "저장 중" });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-disabled")).toBe("true");
  });

  it("loading 중에는 포커스를 잃지 않도록 disabled 속성을 쓰지 않는다", () => {
    const { rerender } = render(<Button>저장</Button>);
    const button = screen.getByRole("button");
    button.focus();
    rerender(<Button loading>저장</Button>);
    expect(button.hasAttribute("disabled")).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("loading인 submit 버튼은 form을 제출하지 않는다", () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          저장
        </Button>
      </form>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
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
