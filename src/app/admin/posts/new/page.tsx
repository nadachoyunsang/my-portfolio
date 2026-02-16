import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">새 글 작성</h2>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
