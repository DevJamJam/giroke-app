import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-primary text-surface hover:opacity-90",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-subtle",
  danger: "bg-danger text-surface hover:opacity-90",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
};

// shortcut: className은 뒤에 이어붙이기만 하고 충돌 클래스를 병합하지 않는다, 덮어쓰기가 필요해지면 tailwind-merge 검토
export function Button({ variant = "primary", type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
