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

## Git 브랜치 전략

- `main`: 배포 브랜치, 항상 배포 가능 상태 유지
- `develop`: 통합 개발 브랜치, feature 브랜치의 병합 대상
- `feature/<이슈번호>-<설명>`: 기능 개발 브랜치, `develop`에서 분기 후 PR로 병합
- 머지 전략: squash merge (PR 통해 병합)
- 원격 레포지토리: GitHub 사용

### 브랜치 네이밍

설명은 영어 kebab-case로 작성.

```
feature/1-initial-project-setup
feature/2-db-schema-design
```

## 이슈 및 PR 관리

- 이슈: GitHub Issues (creating-github-issues 스킬), 담당자(assignee): `dev-msj`
- PR: GitHub Pull Requests (creating-pull-requests 스킬)
- feature → develop PR: `Closes #이슈번호` 포함, 이슈 자동 close는 develop → main 머지 시 발생
- develop → main PR: 배포 시점에 생성
- 한국어 작성

## 커밋 메시지

Conventional Commits 형식, 한국어 작성:

```
<type>: <설명>

[본문]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

타입: `feat`, `fix`, `chore`, `style`, `refactor`, `docs`, `test`

## 프론트엔드 구현 규칙

글로벌 "구현 기본 규칙"의 프로젝트 특화 확장.

- 접근성: 콘텐츠 이미지에 의미 있는 alt 텍스트 필수, 폼 요소에 label 연결
- 사용자 피드백: `alert()`/`prompt()` 사용 금지 → Toast(`useToast`) 또는 인라인 UI 사용. `confirm()`은 삭제 등 파괴적 작업 확인에만 허용
- 브라우저 리소스: `URL.createObjectURL()` 사용 후 반드시 `revokeObjectURL()` 호출. `addEventListener` 등록 시 cleanup 필수
- Supabase 타입: `src/types/database.ts`에 테이블/함수 타입 정의 유지. `as any` 대신 타입 정의 수정으로 해결

## 데이터베이스 규칙

- `supabase db reset` 절대 금지 (사용자가 명시적으로 요청한 경우에만 허용)
- 마이그레이션 적용: `npx supabase migration up` (증분 적용만)
- 마이그레이션 파일은 기존 데이터를 보존하도록 작성 (DROP/TRUNCATE 금지, INSERT 시 `ON CONFLICT` 사용)
- 데이터 충돌 가능성이 있는 마이그레이션: 충돌 시나리오와 대안 1~3개를 제시하고 사용자 선택 후 진행

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run format       # Prettier 포맷팅
npm run format:check # Prettier 체크
```
