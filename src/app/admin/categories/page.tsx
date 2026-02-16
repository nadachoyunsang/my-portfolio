import CategoryManagement from '@/components/admin/CategoryManagement';
import { getCategories } from '@/lib/categories';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h2 className="text-2xl font-bold">카테고리 관리</h2>
      <p className="mt-2 text-sm text-muted">
        포트폴리오 카테고리를 추가, 수정, 삭제할 수 있습니다.
      </p>
      <div className="mt-6">
        <CategoryManagement categories={categories} />
      </div>
    </div>
  );
}
