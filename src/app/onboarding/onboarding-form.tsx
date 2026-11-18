"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authErrorMessage, validateNickname } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

// 15장: timezone은 브라우저에서 감지하고 사용자가 고칠 수 있다(위치 권한 불필요).
// 서버 렌더링 때는 브라우저 값을 모르므로 빈 값 → hydration 후 감지값 (불일치 경고 방지)
const noop = () => () => {};
const useDetectedTimezone = () =>
  useSyncExternalStore(noop, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => "");

export function OnboardingForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const detected = useDetectedTimezone();
  const [chosen, setChosen] = useState<string>();
  const timezone = chosen ?? detected;
  const [nicknameError, setNicknameError] = useState<string>();

  const onboard = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().rpc("complete_onboarding", { p_nickname: nickname, p_timezone: timezone });
      if (error) throw error;
    },
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = validateNickname(nickname);
    setNicknameError(error);
    if (!error && timezone) onboard.mutate();
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">반가워요!</h1>
        <p className="text-sm text-foreground-muted">기록해요에서 쓸 이름과 시간대를 확인해 주세요.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input label="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} hint="1~20자" error={nicknameError} maxLength={40} required />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="timezone" className="text-sm font-medium">
            시간대
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setChosen(e.target.value)}
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            {/* 감지값이 별칭(예: Asia/Calcutta)이라 목록에 없을 수 있어 맨 앞에 넣는다 */}
            {(detected ? [...new Set([detected, ...Intl.supportedValuesOf("timeZone")])] : []).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        {onboard.isError && (
          <p role="alert" className="text-sm text-danger">
            {"code" in onboard.error && onboard.error.code === "22023"
              ? "이 시간대는 지원하지 않아요. 다른 시간대를 골라 주세요."
              : authErrorMessage(onboard.error)}
          </p>
        )}
        <Button type="submit" loading={onboard.isPending}>
          시작하기
        </Button>
      </form>
    </>
  );
}
