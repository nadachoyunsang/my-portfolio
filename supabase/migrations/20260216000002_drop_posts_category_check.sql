-- posts.category CHECK 제약 제거 (동적 카테고리 지원)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
