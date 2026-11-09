const config = {
  extends: ["@commitlint/config-conventional"],
  // merge 커밋도 검사한다. 기본값(true)은 "Merge pull request …" 같은 제목을 건너뛴다.
  defaultIgnores: false,
  rules: {
    // 한국어 제목은 "Next.js", "Git" 같은 고유명사로 시작하는 경우가 많아 대소문자 규칙을 끈다.
    "subject-case": [0],
  },
};

export default config;
