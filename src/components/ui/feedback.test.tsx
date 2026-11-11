import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { Haeyo } from "../haeyo";
import { Empty } from "./empty";
import { Modal } from "./modal";
import { Toaster, toast, useToastStore } from "./toast";

afterEach(cleanup);

describe("Modal", () => {
  // jsdom에는 showModal/close가 없어 최소 동작만 흉내 낸다(실제 동작은 브라우저에서 확인)
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  });

  it("open이면 제목으로 이름 붙은 dialog를 연다", () => {
    render(
      <Modal open onClose={() => {}} title="삭제할까요?">
        내용
      </Modal>,
    );
    expect(screen.getByRole("dialog", { name: "삭제할까요?" }).hasAttribute("open")).toBe(true);
  });

  it("배경을 누르면 닫고 onClose를 부른다, 내용을 누르면 닫지 않는다", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="삭제할까요?">
        <p>내용</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("내용"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("open이 false로 바뀌면 닫는다", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} title="삭제할까요?">
        내용
      </Modal>,
    );
    rerender(
      <Modal open={false} onClose={() => {}} title="삭제할까요?">
        내용
      </Modal>,
    );
    expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("open")).toBe(false);
  });
});

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState(useToastStore.getInitialState(), true);
  });
  afterEach(() => vi.useRealTimers());

  it("live region 안에 메시지를 보여주고 4초 뒤 사라진다", () => {
    render(<Toaster />);
    const region = screen.getByRole("status");
    act(() => toast("저장했어요"));
    expect(region.textContent).toBe("저장했어요");
    act(() => vi.advanceTimersByTime(4000));
    expect(region.textContent).toBe("");
  });

  it("여러 개를 순서대로 쌓고 각자 사라진다", () => {
    render(<Toaster />);
    act(() => toast("첫째"));
    act(() => vi.advanceTimersByTime(1000));
    act(() => toast("둘째"));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole("status").textContent).toBe("둘째");
  });
});

describe("Empty", () => {
  it("제목·설명·행동 버튼을 보여주고 Haeyo는 장식으로 숨긴다", () => {
    const { container } = render(
      <Empty title="할 일이 없어요" description="추가해 보세요" action={<button>추가</button>} />,
    );
    expect(screen.getByText("할 일이 없어요")).toBeDefined();
    expect(screen.getByRole("button", { name: "추가" })).toBeDefined();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Haeyo", () => {
  it("label이 있으면 이름 있는 이미지로 노출한다", () => {
    render(<Haeyo rating={5} label="만족스러운 날" />);
    expect(screen.getByRole("img", { name: "만족스러운 날" }).getAttribute("data-rating")).toBe("5");
  });
});
