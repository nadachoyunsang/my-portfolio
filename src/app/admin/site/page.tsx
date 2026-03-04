import SiteContentForm from '@/components/admin/SiteContentForm';
import { getSiteContent } from '@/lib/siteContent';
import { createClient } from '@/lib/supabase/server';
import { getIntroVideoUrl } from '@/lib/video';

export default async function AdminSitePage() {
  const supabase = await createClient();
  const [content, introVideoUrl] = await Promise.all([
    getSiteContent(),
    getIntroVideoUrl(supabase),
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold">사이트 콘텐츠 관리</h2>
      <p className="mt-2 text-sm text-muted">
        홈 화면에 표시되는 자기소개 및 연락처 정보를 수정합니다.
      </p>
      <div className="mt-6">
        <SiteContentForm content={content} introVideoUrl={introVideoUrl} />
      </div>
    </div>
  );
}
