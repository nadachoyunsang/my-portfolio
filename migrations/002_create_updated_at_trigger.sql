-- 002: updated_at 자동 갱신 트리거
-- Supabase 대시보드 SQL Editor에서 실행

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- posts 테이블에 트리거 적용
CREATE TRIGGER trigger_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- site_content 테이블에 트리거 적용
CREATE TRIGGER trigger_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- featured_content 테이블에 트리거 적용
CREATE TRIGGER trigger_featured_content_updated_at
  BEFORE UPDATE ON featured_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
