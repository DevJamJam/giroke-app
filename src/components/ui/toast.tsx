"use client";

import { create } from "zustand";

type Toast = { id: number; message: string };

type ToastState = {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
};

const DURATION_MS = 4000;
let nextId = 0;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => get().dismiss(id), DURATION_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

/** React 밖(이벤트 핸들러, mutation 콜백)에서도 부를 수 있다 */
export const toast = (message: string) => useToastStore.getState().show(message);

// 루트 레이아웃에 한 번 둔다. live region은 내용보다 먼저 DOM에 있어야 스크린리더가 변화를 읽는다
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-20 flex flex-col items-center gap-2 px-4 lg:bottom-6"
    >
      {toasts.map((item) => (
        <p
          key={item.id}
          className="rounded-md bg-foreground px-4 py-3 text-sm text-background shadow-lg"
        >
          {item.message}
        </p>
      ))}
    </div>
  );
}
