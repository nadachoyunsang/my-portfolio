# 이슈 관리

## 이슈 목록

| # | 제목 | 라벨 | 상태 | 의존성 |
| - | - | - | - | - |
| 1 | 프로젝트 초기 설정 | setup | done | - |
| 2 | DB 스키마 설계 및 Supabase 설정 | setup, database | open | #1 |
| 3 | 인증 시스템 (Google OAuth) | feature, security | open | #2 |
| 4 | 홈 페이지 레이아웃 및 공통 UI | feature, ui | open | #1 |
| 5 | 블로그 목록 및 카테고리 필터 | feature | open | #2, #4 |
| 6 | 블로그 글 상세 페이지 | feature | open | #5 |
| 7 | 관리자 - 블로그 글 관리 (CRUD) | feature, admin | open | #3, #5 |
| 8 | 관리자 - 사이트 콘텐츠 관리 | feature, admin | open | #3, #4 |
| 9 | 반응형 디자인 및 접근성 | enhancement, a11y | open | #4, #5, #6 |
| 10 | Vercel 배포 설정 | setup, deploy | open | #1 |

## 라벨 정의

| 라벨 | 설명 |
| - | - |
| setup | 프로젝트 설정/인프라 |
| feature | 새 기능 |
| enhancement | 개선 |
| database | 데이터베이스 관련 |
| security | 보안 관련 |
| admin | 관리자 기능 |
| ui | UI/디자인 |
| a11y | 접근성 |
| deploy | 배포 |

## 상태 정의

| 상태 | 설명 |
| - | - |
| open | 미착수 |
| in-progress | 진행 중 |
| closed | 완료 |

## 의존성 그래프

```
#1 프로젝트 초기 설정
├── #2 DB 스키마 설계 및 Supabase 설정
│   ├── #3 인증 시스템
│   │   ├── #7 관리자 - 블로그 글 관리
│   │   └── #8 관리자 - 사이트 콘텐츠 관리
│   └── #5 블로그 목록 및 카테고리 필터
│       ├── #6 블로그 글 상세 페이지
│       └── #7 관리자 - 블로그 글 관리
├── #4 홈 페이지 레이아웃 및 공통 UI
│   ├── #5 블로그 목록 및 카테고리 필터
│   ├── #8 관리자 - 사이트 콘텐츠 관리
│   └── #9 반응형 디자인 및 접근성
└── #10 Vercel 배포 설정
```
