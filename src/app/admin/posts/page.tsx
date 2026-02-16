import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];

const CATEGORY_LABEL: Record<string, string> = {
  documentary: '다큐멘터리',
  book: '책',
  article: '기사',
};

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select()
    .order('created_at', { ascending: false });

  const posts = data as Post[] | null;

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

      <div className="mt-6 space-y-2">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}/edit`}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-card"
            >
              <div>
                <span className="font-medium">{post.title}</span>
                <span className="ml-3 text-xs text-muted">
                  {CATEGORY_LABEL[post.category] ?? post.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    post.published
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-neutral-800 text-muted'
                  }`}
                >
                  {post.published ? '공개' : '비공개'}
                </span>
                <span className="text-xs text-muted">
                  {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="py-12 text-center text-muted">글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
