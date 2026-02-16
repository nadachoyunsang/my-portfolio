-- 003: RLS 활성화 및 접근 정책
-- Supabase 대시보드 SQL Editor에서 실행

-- ===== posts =====
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 비로그인 사용자: 공개 글만 조회
CREATE POLICY "posts_select_anon"
  ON posts FOR SELECT
  TO anon
  USING (published = true);

-- 인증된 사용자: 전체 조회
CREATE POLICY "posts_select_authenticated"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- 인증된 사용자: 생성
CREATE POLICY "posts_insert_authenticated"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 인증된 사용자: 수정
CREATE POLICY "posts_update_authenticated"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 인증된 사용자: 삭제
CREATE POLICY "posts_delete_authenticated"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- ===== site_content =====
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 모든 사용자: 조회
CREATE POLICY "site_content_select_all"
  ON site_content FOR SELECT
  USING (true);

-- 인증된 사용자: 생성
CREATE POLICY "site_content_insert_authenticated"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 인증된 사용자: 수정
CREATE POLICY "site_content_update_authenticated"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===== featured_content =====
ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;

-- 모든 사용자: 조회
CREATE POLICY "featured_content_select_all"
  ON featured_content FOR SELECT
  USING (true);

-- 인증된 사용자: 생성
CREATE POLICY "featured_content_insert_authenticated"
  ON featured_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 인증된 사용자: 수정
CREATE POLICY "featured_content_update_authenticated"
  ON featured_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 인증된 사용자: 삭제
CREATE POLICY "featured_content_delete_authenticated"
  ON featured_content FOR DELETE
  TO authenticated
  USING (true);
