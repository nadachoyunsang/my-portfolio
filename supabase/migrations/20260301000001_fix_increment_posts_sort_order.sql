-- pg_safeupdate에 의해 WHERE 절 없는 UPDATE가 차단되므로 WHERE true 추가
CREATE OR REPLACE FUNCTION increment_posts_sort_order()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE posts SET sort_order = sort_order + 1 WHERE true;
$$;
