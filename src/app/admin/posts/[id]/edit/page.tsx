import { notFound } from 'next/navigation';

import PostForm from '@/components/admin/PostForm';
import DeletePostButton from '@/components/admin/DeletePostButton';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];
type Params = { id: string };

export default async function EditPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from('posts').select().eq('id', id).single();

  const post = data as Post | null;
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">글 수정</h2>
        <DeletePostButton postId={post.id} postTitle={post.title} />
      </div>
      <div className="mt-6">
        <PostForm post={post} />
      </div>
    </div>
  );
}
