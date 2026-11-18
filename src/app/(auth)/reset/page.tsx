"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { PASSWORD_MIN_LENGTH, authErrorMessage, validateCode, validateEmail, validatePassword } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

// 1단계: 이메일로 6자리 코드 받기 → 2단계: 코드 + 새 비밀번호 (R-09)
export default function ResetPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string }>({});
  // 코드 확인은 한 번만: 비밀번호 저장만 실패했으면 코드를 다시 쓰지 않는다
  const [verified, setVerified] = useState(false);

  const sendCode = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
    },
    // 가입되지 않은 이메일이어도 같은 안내(가입 여부를 노출하지 않음)
    onSuccess: () => setStep("code"),
  });

  const reset = useMutation({
    mutationFn: async () => {
      if (!verified) {
        const { error } = await getSupabase().auth.verifyOtp({ email: email.trim(), token: code, type: "recovery" });
        if (error) throw error;
        setVerified(true);
      }
      const { error } = await getSupabase().auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      toast("비밀번호를 바꿨어요.");
      router.replace("/");
      router.refresh();
    },
  });

  function submitEmail(event: FormEvent) {
    event.preventDefault();
    const error = validateEmail(email);
    setErrors({ email: error });
    if (!error) sendCode.mutate();
  }

  function submitReset(event: FormEvent) {
    event.preventDefault();
    const next = { code: verified ? undefined : validateCode(code), password: validatePassword(password) };
    setErrors(next);
    if (!next.code && !next.password) reset.mutate();
  }

  if (step === "email") {
    return (
      <>
        <h1 className="text-lg font-semibold">비밀번호 재설정</h1>
        <form onSubmit={submitEmail} className="flex flex-col gap-4" noValidate>
          <Input label="가입한 이메일" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          {sendCode.isError && (
            <p role="alert" className="text-sm text-danger">
              {authErrorMessage(sendCode.error)}
            </p>
          )}
          <Button type="submit" loading={sendCode.isPending}>
            재설정 코드 받기
          </Button>
        </form>
        <Link href="/login" className="text-sm text-foreground-muted underline-offset-4 hover:underline">
          로그인으로 돌아가기
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">새 비밀번호</h1>
        <p className="text-sm text-foreground-muted">가입된 이메일이면 6자리 코드를 보냈어요.</p>
      </div>
      <form onSubmit={submitReset} className="flex flex-col gap-4" noValidate>
        {!verified && (
          <Input
            label="재설정 코드"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            error={errors.code}
            required
          />
        )}
        <Input
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={`${PASSWORD_MIN_LENGTH}자 이상`}
          error={errors.password}
          required
        />
        {reset.isError && (
          <p role="alert" className="text-sm text-danger">
            {authErrorMessage(reset.error)}
          </p>
        )}
        <Button type="submit" loading={reset.isPending}>
          비밀번호 바꾸기
        </Button>
      </form>
    </>
  );
}
