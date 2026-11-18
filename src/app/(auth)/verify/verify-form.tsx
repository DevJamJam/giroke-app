"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authErrorMessage, validateCode } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

export function VerifyForm({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();

  const verify = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.verifyOtp({ email, token: code, type: "email" });
      if (error) throw error;
    },
    onSuccess: () => {
      router.replace("/onboarding");
      router.refresh();
    },
  });

  const resend = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.resend({ type: "signup", email });
      if (error) throw error;
    },
    onSuccess: () => toast("새 코드를 보냈어요."),
    onError: (error) => toast(authErrorMessage(error)),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = validateCode(code);
    setCodeError(error);
    if (!error) verify.mutate();
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">가입 인증</h1>
        <p className="text-sm text-foreground-muted">
          <span className="font-medium text-foreground">{email}</span>(으)로 보낸 6자리 코드를 입력해 주세요.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input
          label="인증 코드"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          error={codeError}
          required
        />
        {verify.isError && (
          <p role="alert" className="text-sm text-danger">
            {authErrorMessage(verify.error)}
          </p>
        )}
        <Button type="submit" loading={verify.isPending}>
          인증하기
        </Button>
      </form>
      <Button variant="secondary" loading={resend.isPending} onClick={() => resend.mutate()}>
        코드 다시 받기
      </Button>
    </>
  );
}
