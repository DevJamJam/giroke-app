import { expect, test, type Page } from "@playwright/test";

// 로컬 Supabase가 보낸 메일은 Mailpit(가짜 메일함)에 쌓인다
const MAILPIT = "http://127.0.0.1:54324";
const PASSWORD = "giroke-pass-1";

const uniqueEmail = (tag: string) => `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`;

/** 해당 주소로 온 가장 최근 메일의 6자리 코드 (subject로 가입·재설정 구분) */
async function latestCode(page: Page, email: string, subject: string) {
  let code: string | undefined;
  await expect
    .poll(async () => {
      const search = await page.request.get(`${MAILPIT}/api/v1/search`, { params: { query: `to:"${email}" subject:"${subject}"` } });
      const { messages } = await search.json();
      if (!messages?.length) return undefined;
      const message = await (await page.request.get(`${MAILPIT}/api/v1/message/${messages[0].ID}`)).json();
      code = /\b(\d{6})\b/.exec(message.Text)?.[1];
      return code;
    }, { timeout: 15_000 })
    .toMatch(/^\d{6}$/);
  return code!;
}

async function signUpAndVerify(page: Page, email: string) {
  await page.goto("/signup");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "인증 코드 받기" }).click();
  await expect(page).toHaveURL(/\/verify\?email=/);
  await page.getByLabel("인증 코드").fill(await latestCode(page, email, "가입 인증"));
  await page.getByRole("button", { name: "인증하기" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
}

async function onboard(page: Page, nickname: string) {
  await page.getByLabel("닉네임").fill(nickname);
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function logout(page: Page) {
  await page.goto("/my");
  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page).toHaveURL(/\/login$/);
}

test("로그인하지 않으면 탭 화면 대신 로그인으로 보낸다", async ({ page }) => {
  for (const path of ["/", "/calendar", "/my", "/onboarding"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
  }
});

test("가입 → 6자리 코드 인증 → 온보딩 → 오늘 탭, 로그아웃 후 다시 로그인", async ({ page }) => {
  const email = uniqueEmail("signup");
  await signUpAndVerify(page, email);

  // 온보딩 전에는 탭 화면에 들어갈 수 없다
  await page.goto("/");
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByLabel("시간대")).not.toHaveValue("");

  await onboard(page, "  해요  ");
  // 온보딩을 마치면 다시 온보딩 화면에 오지 않는다
  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/$/);
  // 로그인 상태에서는 로그인 화면 대신 앱으로
  await page.goto("/login");
  await expect(page).toHaveURL(/\/$/);

  await logout(page);
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("입력 오류와 틀린 코드·비밀번호는 화면에 안내한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("이메일").fill("not-an-email");
  await page.getByLabel("비밀번호").fill("short");
  await page.getByRole("button", { name: "인증 코드 받기" }).click();
  await expect(page.getByText("이메일 형식을 확인해 주세요.")).toBeVisible();
  await expect(page.getByText("비밀번호는 8자 이상이어야 해요.")).toBeVisible();

  const email = uniqueEmail("wrong");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "인증 코드 받기" }).click();
  const code = await latestCode(page, email, "가입 인증");
  await page.getByLabel("인증 코드").fill(code === "000000" ? "111111" : "000000");
  await page.getByRole("button", { name: "인증하기" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "코드가 틀렸거나 만료됐어요" })).toBeVisible();

  // 인증 전 로그인 시도 → 새 코드 발송 후 인증 화면으로
  await page.goto("/login");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/verify\?email=/);

  await page.goto("/login");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill("wrong-password");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "이메일 또는 비밀번호가 맞지 않아요." })).toBeVisible();
});

test("비밀번호 재설정: 코드 → 새 비밀번호, 이전 비밀번호로는 로그인 불가", async ({ page }) => {
  const email = uniqueEmail("reset");
  await signUpAndVerify(page, email);
  await onboard(page, "재설정");
  await logout(page);

  await page.getByRole("link", { name: "비밀번호를 잊었어요" }).click();
  await page.getByLabel("가입한 이메일").fill(email);
  await page.getByRole("button", { name: "재설정 코드 받기" }).click();
  await page.getByLabel("재설정 코드").fill(await latestCode(page, email, "비밀번호 재설정"));
  await page.getByLabel("새 비밀번호").fill("new-pass-2026");
  await page.getByRole("button", { name: "비밀번호 바꾸기" }).click();
  await expect(page).toHaveURL(/\/$/);

  await logout(page);
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "맞지 않아요" })).toBeVisible();
  await page.getByLabel("비밀번호").fill("new-pass-2026");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/$/);
});
