import Link from 'next/link';

import PostSortableList from '@/components/admin/PostSortableList';
import { getCategories } from '@/lib/categories';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];

export default async function AdminPostsPage() {
  const [supabase, categories] = await Promise.all([
    createClient(),
    getCategories(),
  ]);

  const { data } = await supabase
    .from('posts')
    .select()
    .order('sort_order', { ascending: true });

  const posts = data as Post[] | null;

  const categoryLabel = Object.fromEntries(
    categories.map((c) => [c.slug, c.name]),
  );

  const postItems = (posts ?? []).map((post) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    categoryLabel: categoryLabel[post.category] ?? '미할당',
    published: post.published,
    created_at: post.created_at,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">글 관리</h2>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          새 글 작성
        </Link>
      </div>

      <div className="mt-6">
        <PostSortableList initialPosts={postItems} />
      </div>
    </div>
  );
}
