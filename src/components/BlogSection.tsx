'use client';

import { useState } from 'react';

import BlogCard from '@/components/BlogCard';
import CategoryTabs from '@/components/CategoryTabs';
import type { PostSummary } from '@/lib/posts';

type ViewMode = 'grid' | 'list';

interface BlogSectionProps {
  posts: PostSummary[];
  categories: { slug: string; name: string }[];
}

export default function BlogSection({ posts, categories }: BlogSectionProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filtered = category
    ? posts.filter((p) => p.category === category)
    : posts;

  return (
    <section id="portfolio" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <div className="flex gap-1" role="group" aria-label="보기 방식">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="그리드 보기"
              aria-pressed={viewMode === 'grid'}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="1" width="6.5" height="6.5" rx="1" />
                <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" />
                <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" />
                <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="리스트 보기"
              aria-pressed={viewMode === 'list'}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="3" x2="17" y2="3" />
                <line x1="1" y1="9" x2="17" y2="9" />
                <line x1="1" y1="15" x2="17" y2="15" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-6">
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={setCategory}
          />
        </div>
        {filtered.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'
                : 'mt-8 flex flex-col gap-4'
            }
          >
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} variant={viewMode} />
            ))}
          </div>
        ) : (
          <p className="mt-8 py-12 text-center text-muted">
            게시글이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
