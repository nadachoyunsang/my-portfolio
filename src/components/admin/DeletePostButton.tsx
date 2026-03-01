'use client';

import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/Toast';
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
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`"${postTitle}" 글을 삭제하시겠습니까?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      toast('글 삭제에 실패했습니다.');
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
