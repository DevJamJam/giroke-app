"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authErrorMessage } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear(); // 같은 브라우저의 다음 사용자에게 이전 데이터가 보이지 않게
      router.replace("/login");
      router.refresh();
    },
    onError: (error) => toast(authErrorMessage(error)),
  });

  return (
    <Button variant="secondary" loading={logout.isPending} onClick={() => logout.mutate()} className="self-start">
      로그아웃
    </Button>
  );
}
