-- 001: 테이블 생성
-- Supabase 대시보드 SQL Editor에서 실행

-- posts (블로그 글)
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  thumbnail_url text,
  category text NOT NULL CHECK (category IN ('documentary', 'book', 'article')),
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 인덱스: 카테고리별 공개 글 필터
CREATE INDEX idx_posts_category_published ON posts (category, published);

-- 인덱스: 최신순 정렬
CREATE INDEX idx_posts_created_at_desc ON posts (created_at DESC);

-- site_content (사이트 콘텐츠)
CREATE TABLE site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- featured_content (대표 콘텐츠)
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

-- 인덱스: 정렬 순서
CREATE INDEX idx_featured_content_sort_order ON featured_content (sort_order);
