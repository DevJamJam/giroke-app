"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authErrorMessage, validateEmail } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();

  const login = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
    },
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
    onError: async (error) => {
      // 인증을 마치지 않은 계정: 새 코드를 보내고 인증 화면으로
      if ("code" in error && error.code === "email_not_confirmed") {
        await getSupabase().auth.resend({ type: "signup", email: email.trim() });
        router.push(`/verify?email=${encodeURIComponent(email.trim())}`);
      }
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);
    if (!error && password) login.mutate();
  }

  return (
    <>
      <h1 className="text-lg font-semibold">로그인</h1>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input label="이메일" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} required />
        <Input label="비밀번호" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {login.isError && (
          <p role="alert" className="text-sm text-danger">
            {authErrorMessage(login.error)}
          </p>
        )}
        <Button type="submit" loading={login.isPending}>
          로그인
        </Button>
      </form>
      <div className="flex justify-between text-sm">
        <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
          가입하기
        </Link>
        <Link href="/reset" className="text-foreground-muted underline-offset-4 hover:underline">
          비밀번호를 잊었어요
        </Link>
      </div>
    </>
  );
}
