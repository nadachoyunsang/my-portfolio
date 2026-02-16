-- 004: Storage 버킷 및 RLS 정책
-- Supabase 대시보드 SQL Editor에서 실행

-- images 버킷 생성 (공개)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- 공개 조회
CREATE POLICY "images_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- 인증된 사용자: 업로드
CREATE POLICY "images_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- 인증된 사용자: 수정
CREATE POLICY "images_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

-- 인증된 사용자: 삭제
CREATE POLICY "images_delete_authenticated"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
