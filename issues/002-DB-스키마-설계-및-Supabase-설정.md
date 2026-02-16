# #2 DB 스키마 설계 및 Supabase 설정

- **라벨**: setup, database
- **상태**: done
- **의존성**: #1

## 설명

Supabase 프로젝트를 생성하고, 요구사항에 맞는 DB 스키마를 설계합니다.

## 작업 목록

- [x] ~~Supabase 프로젝트 생성~~ → 대시보드에서 수동 생성 후 .env.local 설정
- [x] 환경변수 설정 (.env.local.example 템플릿)
- [x] Supabase 클라이언트 설정 (서버/클라이언트/미들웨어)
- [x] DB 스키마 설계 및 마이그레이션 작성 (SQL 파일)
- [x] Supabase Storage 버킷 생성 (SQL 파일)
- [x] RLS(Row Level Security) 정책 설정 (SQL 파일)

## 스키마 초안

### posts (블로그 글)

| 컬럼 | 타입 | 설명 |
| - | - | - |
| id | uuid, PK | |
| title | text, NOT NULL | 글 제목 |
| slug | text, UNIQUE | URL 슬러그 |
| content | text | 본문 (HTML) |
| excerpt | text | 요약 |
| thumbnail_url | text | 썸네일 이미지 URL |
| category | text, NOT NULL | 카테고리 (documentary, book, article) |
| tags | text[] | 태그 배열 |
| published | boolean, DEFAULT false | 공개 여부 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

### site_content (사이트 콘텐츠)

| 컬럼 | 타입 | 설명 |
| - | - | - |
| id | uuid, PK | |
| key | text, UNIQUE | 콘텐츠 키 (intro_name, intro_job, intro_bio, contact_email 등) |
| value | text | 콘텐츠 값 |
| updated_at | timestamptz | 수정일 |

### featured_content (대표 콘텐츠)

| 컬럼 | 타입 | 설명 |
| - | - | - |
| id | uuid, PK | |
| title | text, NOT NULL | 제목 |
| description | text | 설명 |
| thumbnail_url | text | 썸네일 이미지 URL |
| link_url | text | 외부 링크 (선택) |
| sort_order | integer | 정렬 순서 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 참고

- 이미지는 Supabase Storage에 저장, URL을 DB에 기록
- 영상은 YouTube 링크로 본문에 임베드
- category 값: `documentary` (다큐멘터리), `book` (책), `article` (기사)
