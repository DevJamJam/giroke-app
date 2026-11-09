const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 한국어 제목은 "Next.js", "Git" 같은 고유명사로 시작하는 경우가 많아 대소문자 규칙을 끈다.
    "subject-case": [0],
  },
};

export default config;
