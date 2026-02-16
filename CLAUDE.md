# YJ-CJS Portfolio Web

## 기술 스택

- **프레임워크**: Next.js 16 (App Router) + React 19
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **데이터베이스**: Supabase (PostgreSQL + Auth + Storage)
- **편집기**: Tiptap (WYSIWYG)
- **배포**: Vercel
- **패키지 매니저**: npm

## 디렉토리 구조

```
src/
├── app/           # Next.js App Router (페이지, 레이아웃)
├── components/    # 공통 컴포넌트
│   └── ui/        # 기본 UI 컴포넌트 (Button, Input 등)
├── lib/           # 유틸리티, Supabase 클라이언트
├── types/         # TypeScript 타입 정의
└── constants/     # 상수 정의
```

## 코딩 컨벤션

### 네이밍

| 대상 | 규칙 | 예시 |
| - | - | - |
| 컴포넌트 파일 | PascalCase | `BlogCard.tsx` |
| 유틸리티 파일 | camelCase | `formatDate.ts` |
| 타입 파일 | camelCase | `blog.ts` |
| 상수 파일 | camelCase | `routes.ts` |
| CSS 클래스 | Tailwind 유틸리티 사용 | - |
| 컴포넌트 | PascalCase | `BlogCard` |
| 함수/변수 | camelCase | `formatDate` |
| 상수 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 타입/인터페이스 | PascalCase | `BlogPost` |

### 파일 구조

- 컴포넌트: 한 파일에 하나의 export default 컴포넌트
- 배럴 export 사용하지 않음 (직접 import)
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'` 명시

### 스타일링

- Tailwind CSS 유틸리티 클래스 사용
- 항상 다크 테마 (라이트 모드 없음)
- 인라인 스타일 사용하지 않음

## Git 브랜치 전략 (로컬 전용)

- `main`: 안정 브랜치
- `feature/<이슈번호>-<설명>`: 기능 개발 브랜치
- 머지 전략: squash merge (`git merge --squash`)
- 원격 레포지토리 없음 (로컬 전용)

### 브랜치 네이밍

```
feature/1-프로젝트-초기-설정
feature/2-DB-스키마-설계
```

## 로컬 이슈 관리

- `issues/` 디렉토리에 마크다운으로 관리
- `issues/README.md`에 이슈 인덱스
- 상태 변경 시 개별 이슈 파일 + README.md 동시 업데이트

## 커밋 메시지

Conventional Commits 형식, 한국어 작성:

```
<type>: <설명>

[본문]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

타입: `feat`, `fix`, `chore`, `style`, `refactor`, `docs`, `test`

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run format       # Prettier 포맷팅
npm run format:check # Prettier 체크
```
