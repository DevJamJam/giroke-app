"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// 네이티브 <dialog>.showModal(): 포커스 가두기·Esc 닫기·배경 비활성(inert)을 브라우저가 처리한다
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // 배경(backdrop)을 누르면 닫는다: backdrop 클릭은 dialog 자신이 target이 된다
      onClick={(event) => event.target === event.currentTarget && ref.current?.close()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-surface p-0 text-foreground backdrop:bg-overlay"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
