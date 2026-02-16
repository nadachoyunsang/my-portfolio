import SiteContentForm from '@/components/admin/SiteContentForm';
import { getSiteContent } from '@/lib/siteContent';

export default async function AdminSitePage() {
  const content = await getSiteContent();

  return (
    <div>
      <h2 className="text-2xl font-bold">사이트 콘텐츠 관리</h2>
      <p className="mt-2 text-sm text-muted">
        홈 화면에 표시되는 자기소개 및 연락처 정보를 수정합니다.
      </p>
      <div className="mt-6">
        <SiteContentForm content={content} />
      </div>
    </div>
  );
}
