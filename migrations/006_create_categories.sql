-- 006: 카테고리 테이블 생성
-- Supabase 대시보드 SQL Editor에서 실행

-- categories 테이블
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_categories_sort_order ON categories (sort_order);

-- 기본 카테고리 데이터 (기존 하드코딩 값)
INSERT INTO categories (name, slug, sort_order) VALUES
  ('다큐멘터리', 'documentary', 1),
  ('책', 'book', 2),
  ('기사', 'article', 3);

-- RLS 정책
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_authenticated"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_update_authenticated"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_delete_authenticated"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- posts.category CHECK 제약 제거 (동적 카테고리 지원)
-- posts 테이블이 존재할 때만 실행
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
  END IF;
END $$;
