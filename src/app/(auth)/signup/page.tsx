"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PASSWORD_MIN_LENGTH, authErrorMessage, validateEmail, validatePassword } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const signup = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.signUp({ email: email.trim(), password });
      if (error) throw error;
    },
    // 이미 가입된 이메일도 같은 화면으로 보낸다(가입 여부를 노출하지 않음)
    onSuccess: () => router.push(`/verify?email=${encodeURIComponent(email.trim())}`),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    if (!next.email && !next.password) signup.mutate();
  }

  return (
    <>
      <h1 className="text-lg font-semibold">가입하기</h1>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input label="이메일" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
        <Input
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={`${PASSWORD_MIN_LENGTH}자 이상`}
          error={errors.password}
          required
        />
        {signup.isError && (
          <p role="alert" className="text-sm text-danger">
            {authErrorMessage(signup.error)}
          </p>
        )}
        <Button type="submit" loading={signup.isPending}>
          인증 코드 받기
        </Button>
      </form>
      <p className="text-sm text-foreground-muted">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>
    </>
  );
}
