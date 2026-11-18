import { describe, expect, it } from "vitest";

import {
  authErrorMessage,
  isAuthPath,
  validateCode,
  validateEmail,
  validateNickname,
  validatePassword,
} from "./auth";

describe("isAuthPath", () => {
  it("인증 화면과 그 하위 경로만 맞다", () => {
    expect(isAuthPath("/login")).toBe(true);
    expect(isAuthPath("/reset/done")).toBe(true);
    expect(isAuthPath("/")).toBe(false);
    expect(isAuthPath("/loginx")).toBe(false); // 접두어 오인 방지
    expect(isAuthPath("/onboarding")).toBe(false);
  });
});

describe("입력 검증", () => {
  it("이메일", () => {
    expect(validateEmail("a@b.co")).toBeUndefined();
    expect(validateEmail("a@b")).toBeDefined();
    expect(validateEmail("a b@c.d")).toBeDefined();
  });

  it("비밀번호 8자 이상(R-40)", () => {
    expect(validatePassword("1234567")).toBeDefined();
    expect(validatePassword("12345678")).toBeUndefined();
  });

  it("코드는 숫자 6자리", () => {
    expect(validateCode("123456")).toBeUndefined();
    expect(validateCode("12345")).toBeDefined();
    expect(validateCode("12345a")).toBeDefined();
  });

  it("닉네임 1~20자, 앞뒤 공백·전각 공백 제외(R-39)", () => {
    expect(validateNickname("  해요  ")).toBeUndefined();
    expect(validateNickname("　")).toBeDefined();
    expect(validateNickname("가".repeat(20))).toBeUndefined();
    expect(validateNickname("가".repeat(21))).toBeDefined();
    expect(validateNickname("😀".repeat(20))).toBeUndefined(); // UTF-16으로는 40이지만 20자
    expect(validateNickname(" 해요")).toBeUndefined(); // NBSP는 DB도 다듬지 않으므로 글자로 센다
  });
});

describe("authErrorMessage", () => {
  it("아는 코드는 한국어 문구, 모르는 오류는 내부 메시지를 숨긴다", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toContain("맞지 않아요");
    expect(authErrorMessage(new Error("relation secret_table does not exist"))).not.toContain("secret_table");
  });
});
