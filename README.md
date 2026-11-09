# 기록해요

[![CI](https://github.com/DevJamJam/giroke-app/actions/workflows/ci.yml/badge.svg)](https://github.com/DevJamJam/giroke-app/actions/workflows/ci.yml)

하루의 할 일·활동·일기를 기록하고 돌아보는 개인 기록 웹앱입니다. (개발 중)

## 기술 스택

- Next.js 16 (App Router) · React 19 · TypeScript 5
- Tailwind CSS 4
- ESLint 9 · Vitest 5

## 시작하기

Node.js 24가 필요합니다 (`.nvmrc`).

```bash
npm ci
cp .env.example .env.local   # 값 입력
npm run dev
```

## 스크립트

| 명령 | 내용 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 라우트 타입 생성 후 `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run build` | 프로덕션 빌드 |

## 커밋 규칙

`npm install` 시 Git hook이 설치됩니다 (simple-git-hooks).

- **pre-commit**: 커밋하는 JS/TS 파일만 ESLint 검사 (lint-staged, 경고 0개)
- **commit-msg**: [Conventional Commits](https://www.conventionalcommits.org/) 형식 검사 (commitlint)
  - 예: `feat(daily): 할 일 이동 추가`, `fix: 날짜 경계 오류 수정`
