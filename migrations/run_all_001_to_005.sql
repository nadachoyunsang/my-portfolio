-- ============================================
-- 통합 마이그레이션: 001 ~ 005
-- Supabase 대시보드 SQL Editor에서 한 번에 실행
-- (006_create_categories는 이미 실행 완료)
-- ============================================

-- ===== 001: 테이블 생성 =====

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  thumbnail_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_posts_category_published ON posts (category, published);
CREATE INDEX idx_posts_created_at_desc ON posts (created_at DESC);

CREATE TABLE site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE featured_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  link_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_featured_content_sort_order ON featured_content (sort_order);

-- ===== 002: updated_at 자동 갱신 트리거 =====

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_featured_content_updated_at
  BEFORE UPDATE ON featured_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ===== 003: RLS 활성화 및 접근 정책 =====

-- posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_anon"
  ON posts FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "posts_select_authenticated"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "posts_insert_authenticated"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "posts_update_authenticated"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "posts_delete_authenticated"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content_select_all"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "site_content_insert_authenticated"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "site_content_update_authenticated"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- featured_content
ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_content_select_all"
  ON featured_content FOR SELECT
  USING (true);

CREATE POLICY "featured_content_insert_authenticated"
  ON featured_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "featured_content_update_authenticated"
  ON featured_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "featured_content_delete_authenticated"
  ON featured_content FOR DELETE
  TO authenticated
  USING (true);

-- ===== 004: Storage 버킷 및 RLS 정책 =====

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

CREATE POLICY "images_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "images_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "images_delete_authenticated"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- ===== 005: 사이트 콘텐츠 초기값 =====

INSERT INTO site_content (key, value) VALUES
  ('intro_name', '홍길동'),
  ('intro_job', '기자 / 작가'),
  ('intro_bio', '다큐멘터리, 책, 기사를 통해 세상의 이야기를 전합니다.'),
  ('contact_email', 'contact@example.com');
