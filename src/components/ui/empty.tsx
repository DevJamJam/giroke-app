import type { ReactNode } from "react";

import { Haeyo } from "@/components/haeyo";

type EmptyProps = {
  title: string;
  description?: string;
  /** 예: 첫 항목 추가 버튼 */
  action?: ReactNode;
};

export function Empty({ title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <Haeyo size={80} />
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-foreground-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
