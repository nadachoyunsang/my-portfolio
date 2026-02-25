-- 수상 내역 테이블 생성
CREATE TABLE awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  organization text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_awards_year_desc ON awards (year DESC);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER trigger_awards_updated_at
  BEFORE UPDATE ON awards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS 정책
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "awards_select_all"
  ON awards FOR SELECT
  USING (true);

CREATE POLICY "awards_insert_authenticated"
  ON awards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "awards_update_authenticated"
  ON awards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "awards_delete_authenticated"
  ON awards FOR DELETE
  TO authenticated
  USING (true);
