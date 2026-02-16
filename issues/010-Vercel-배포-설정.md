# #10 Vercel 배포 설정

- **라벨**: setup, deploy
- **상태**: done
- **의존성**: #1

## 설명

Vercel에 프로젝트를 배포하고, 무료 도메인(.vercel.app)을 설정합니다.

## 작업 목록

- [x] 빌드 설정 확인 (next.config.ts, 이미지 도메인 등)
- [x] 환경변수 예제 파일 (.env.local.example)
- [ ] GitHub 레포지토리 생성 및 연결 (수동)
- [ ] Vercel 프로젝트 생성 (수동)
- [ ] Vercel 환경변수 설정 (수동)
- [ ] 배포 테스트 및 도메인 확인 (수동)

## 배포 절차 (수동)

### 1. GitHub 레포지토리 생성

```bash
# GitHub에서 새 레포 생성 후
git remote add origin https://github.com/<username>/yj-cjs-portfolio-web.git
git push -u origin main
```

### 2. Vercel 연결

1. [vercel.com](https://vercel.com) 접속 → Import Git Repository
2. 위 GitHub 레포 선택
3. Framework Preset: Next.js (자동 감지)

### 3. 환경변수 설정 (Vercel 대시보드 → Settings → Environment Variables)

| 변수명 | 설명 |
| - | - |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ADMIN_EMAIL` | 관리자 이메일 (Google OAuth) |

### 4. Supabase 설정

- Authentication → URL Configuration → Site URL을 Vercel 도메인으로 변경
- Authentication → URL Configuration → Redirect URLs에 `https://<프로젝트>.vercel.app/auth/callback` 추가

## 참고

- 이후 main 브랜치에 push할 때마다 자동 배포
- 환경변수는 Vercel 대시보드에서 관리
