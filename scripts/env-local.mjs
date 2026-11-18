// 로컬 Supabase(`supabase start`)의 브라우저 공개용 값(URL·publishable key)만 .env.local에 쓴다.
// 관리자 키는 옮기지 않는다(브라우저 노출 금지, 기획서 R-07).
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const raw = execFileSync("npx", ["supabase", "status", "-o", "json"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
const status = JSON.parse(raw.slice(raw.indexOf("{")));

if (!status.API_URL || !status.PUBLISHABLE_KEY) {
  throw new Error("supabase status에서 API_URL·PUBLISHABLE_KEY를 찾지 못했습니다. `npx supabase start`를 먼저 실행하세요.");
}

writeFileSync(
  ".env.local",
  `NEXT_PUBLIC_SUPABASE_URL=${status.API_URL}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${status.PUBLISHABLE_KEY}\n`,
);
console.log(".env.local 작성 완료 (URL·publishable key만)");
