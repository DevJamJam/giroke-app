# 기록해요

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
