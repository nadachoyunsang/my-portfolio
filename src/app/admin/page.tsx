import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">대시보드</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/posts"
          className="rounded-lg border border-border p-6 transition-colors hover:bg-card"
        >
          <h3 className="font-semibold">글 관리</h3>
          <p className="mt-1 text-sm text-muted">블로그 글 작성, 수정, 삭제</p>
        </Link>
      </div>
    </div>
  );
}
