'use client';

import { useState } from 'react';

import BlogCard from '@/components/BlogCard';
import CategoryTabs from '@/components/CategoryTabs';
import type { PostSummary } from '@/lib/posts';

interface BlogSectionProps {
  posts: PostSummary[];
  categories: { slug: string; name: string }[];
}

export default function BlogSection({ posts, categories }: BlogSectionProps) {
  const [category, setCategory] = useState<string | null>(null);

  const filtered = category
    ? posts.filter((p) => p.category === category)
    : posts;

  return (
    <section id="blog" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        <div className="mt-6">
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={setCategory}
          />
        </div>
        <div className="mt-8 flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <p className="py-12 text-center text-muted">게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
