import AwardManagement from '@/components/admin/AwardManagement';
import { getAwards } from '@/lib/awards';

export default async function AdminAwardsPage() {
  const awards = await getAwards();

  return (
    <div>
      <h2 className="text-2xl font-bold">수상 내역 관리</h2>
      <p className="mt-2 text-sm text-muted">
        프로필에 표시되는 수상 내역을 추가, 수정, 삭제할 수 있습니다.
      </p>
      <div className="mt-6">
        <AwardManagement awards={awards} />
      </div>
    </div>
  );
}
