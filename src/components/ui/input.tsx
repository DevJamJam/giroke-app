import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

// label·안내·오류를 input과 연결해 스크린리더가 함께 읽게 한다
export function Input({ label, hint, error, id, className = "", ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`min-h-11 rounded-md border bg-surface px-3 text-foreground placeholder:text-foreground-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:opacity-40 ${error ? "border-danger" : "border-border"} ${className}`}
        {...props}
      />
      {message && (
        <p id={messageId} className={`text-sm ${error ? "text-danger" : "text-foreground-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
