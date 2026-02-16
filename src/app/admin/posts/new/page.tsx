import PostForm from '@/components/admin/PostForm';
import { getCategories } from '@/lib/categories';

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div>
      <h2 className="text-2xl font-bold">새 글 작성</h2>
      <div className="mt-6">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}
