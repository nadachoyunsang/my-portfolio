'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export default function DeletePostButton({
  postId,
  postTitle,
}: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${postTitle}" 글을 삭제하시겠습니까?`)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
    >
      삭제
    </button>
  );
}
