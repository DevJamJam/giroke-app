import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-primary text-surface hover:opacity-90",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-subtle",
  danger: "bg-danger text-surface hover:opacity-90",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  /** 저장 중: 중복 제출을 막고 aria-busy로 진행 중임을 알린다. disabled와 달리 포커스를 유지한다 */
  loading?: boolean;
};

// shortcut: className은 뒤에 이어붙이기만 하고 충돌 클래스를 병합하지 않는다, 덮어쓰기가 필요해지면 tailwind-merge 검토
export function Button({
  variant = "primary",
  type = "button",
  loading = false,
  disabled,
  className = "",
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      // 진짜 disabled로 바꾸면 키보드 포커스가 페이지 처음으로 튀므로 aria-disabled + 클릭 차단으로 막는다
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault(); // type="submit"이어도 form 제출을 막는다
          return;
        }
        onClick?.(event);
      }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 aria-disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden size={16} className="motion-safe:animate-spin" />}
      {children}
    </button>
  );
}
