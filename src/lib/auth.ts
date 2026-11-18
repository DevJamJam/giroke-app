// 인증 화면 공통 규칙: 경로, 입력 검증, 오류 문구

/** 로그인하지 않은 사람만 쓰는 화면 */
export const AUTH_PATHS = ["/login", "/signup", "/verify", "/reset"] as const;

export const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const PASSWORD_MIN_LENGTH = 8; // R-40

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "이메일 형식을 확인해 주세요.";
}

export function validatePassword(password: string) {
  return password.length >= PASSWORD_MIN_LENGTH ? undefined : `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`;
}

export function validateCode(code: string) {
  return /^\d{6}$/.test(code) ? undefined : "메일로 받은 6자리 숫자를 입력해 주세요.";
}

/** R-39: 1~20자. DB check와 같은 규칙: 같은 공백 문자만 다듬고, 길이는 code point로 센다(이모지 1개 = 1자) */
export function validateNickname(nickname: string) {
  const length = [...nickname.replace(/^[ \t\n\r　]+|[ \t\n\r　]+$/g, "")].length;
  return length >= 1 && length <= 20 ? undefined : "닉네임은 1~20자로 입력해 주세요.";
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 맞지 않아요.",
  email_not_confirmed: "이메일 인증이 아직 끝나지 않았어요.",
  weak_password: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`,
  otp_expired: "코드가 틀렸거나 만료됐어요. 새 코드를 받아 주세요.",
  over_email_send_rate_limit: "메일을 너무 자주 요청했어요. 잠시 후 다시 시도해 주세요.",
  over_request_rate_limit: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
  same_password: "이전과 다른 비밀번호를 입력해 주세요.",
  email_address_invalid: "이메일 형식을 확인해 주세요.",
};

/** Supabase·DB 오류를 사용자 문구로 바꾼다. 모르는 오류는 일반 문구(내부 메시지는 노출하지 않음) */
export function authErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return MESSAGES[code] ?? "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
}
