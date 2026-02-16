# YJ-CJS 포트폴리오 웹사이트

개인 포트폴리오 웹사이트입니다. 다큐멘터리, 책, 기사 등 다양한 콘텐츠를 소개하고,
관리자 페이지에서 직접 글을 작성하고 관리할 수 있습니다.

## 사용 중인 서비스

| 서비스 | 역할 | 주소 |
|--------|------|------|
| **Vercel** | 웹사이트가 돌아가는 곳 (호스팅) | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Supabase** | 글, 카테고리 등 데이터가 저장되는 곳 | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **GCP** | Google 로그인 설정 | [console.cloud.google.com](https://console.cloud.google.com) |

## 주요 기능

- 포트폴리오 글 목록 (카테고리별 탭 필터)
- 관리자 페이지에서 글 작성/수정/삭제 (`사이트주소/auth/login`에서 로그인 후 사용)
- 카테고리 관리 (추가/수정/삭제/순서 변경)
- 사이트 이름, 소개글, 연락처 수정
- Google 계정 로그인 (관리자 전용)

## 폴더 구조 (간략)

```
src/
├── app/           # 웹사이트 페이지들
│   ├── admin/     # 관리자 페이지
│   ├── portfolio/ # 포트폴리오 상세 페이지
│   └── api/       # 자동 처리 기능 (Cron 등)
├── components/    # 화면에 보이는 부품들
├── lib/           # 내부 유틸리티
├── types/         # 데이터 형식 정의
└── constants/     # 고정값 정의
docs/
├── HANDOVER.md          # 서비스 관리 가이드
└── CLAUDE_CODE_GUIDE.md # Claude Code 사용법
```

## 자동 유지 관리

Supabase 무료 플랜은 오랫동안 접속이 없으면 데이터베이스가 자동으로 일시 중지됩니다.
이를 방지하기 위해 **매일 오전 9시(UTC)에 자동으로 데이터베이스에 접속**하여 활성 상태를 유지합니다.
Vercel이 자동으로 처리하므로 별도 관리가 필요 없습니다.

## 관련 문서

- **서비스 관리 가이드** - 각 서비스 대시보드 사용법, 환경변수, 문제 해결 등
  → [docs/HANDOVER.md](docs/HANDOVER.md)
- **Claude Code 사용법** - 비개발자도 코드를 수정할 수 있는 AI 도구 가이드
  → [docs/CLAUDE_CODE_GUIDE.md](docs/CLAUDE_CODE_GUIDE.md)
