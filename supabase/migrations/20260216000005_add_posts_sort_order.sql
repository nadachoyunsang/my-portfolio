-- posts 테이블에 sort_order 컬럼 추가
ALTER TABLE posts ADD COLUMN sort_order integer DEFAULT 0 NOT NULL;

-- 기존 데이터: created_at 최신순으로 sort_order 할당 (최신=0, 그 다음=1, ...)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS rn
  FROM posts
)
UPDATE posts
SET sort_order = ranked.rn
FROM ranked
WHERE posts.id = ranked.id;

-- 인덱스 추가
CREATE INDEX idx_posts_sort_order ON posts (sort_order);

-- 새 글 삽입 시 기존 글 sort_order를 +1 하는 함수
CREATE OR REPLACE FUNCTION increment_posts_sort_order()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE posts SET sort_order = sort_order + 1;
$$;
