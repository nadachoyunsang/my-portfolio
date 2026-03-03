'use client';

import { useState } from 'react';

import BlogCard, { type GridSize } from '@/components/BlogCard';
import CategoryTabs from '@/components/CategoryTabs';
import {
  OTHER_CATEGORY_LABEL,
  OTHER_CATEGORY_SLUG,
} from '@/constants/category';
import type { PostSummary } from '@/lib/posts';

type ViewMode = 'grid' | 'list';

const sizeConfig: Record<
  GridSize,
  { gridCols: string; listGap: string; label: string }
> = {
  sm: {
    gridCols: 'mt-8 grid grid-cols-3 gap-3 xl:grid-cols-5',
    listGap: 'mt-8 flex flex-col gap-3',
    label: '소',
  },
  md: {
    gridCols: 'mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4',
    listGap: 'mt-8 flex flex-col gap-4',
    label: '중',
  },
  lg: {
    gridCols: 'mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3',
    listGap: 'mt-8 flex flex-col gap-5',
    label: '대',
  },
};

interface BlogSectionProps {
  posts: PostSummary[];
  categories: { slug: string; name: string }[];
  defaultGridSize?: GridSize;
}

export default function BlogSection({
  posts,
  categories,
  defaultGridSize = 'md',
}: BlogSectionProps) {
  const orphanPosts = posts.filter(
    (p) => !categories.some((c) => c.slug === p.category),
  );
  const tabCategories =
    orphanPosts.length > 0
      ? [
          ...categories,
          { slug: OTHER_CATEGORY_SLUG, name: OTHER_CATEGORY_LABEL },
        ]
      : categories;

  const [category, setCategory] = useState<string | null>(
    tabCategories[0]?.slug ?? null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [gridSize, setGridSize] = useState<GridSize>(defaultGridSize);

  const filtered =
    category === OTHER_CATEGORY_SLUG
      ? orphanPosts
      : category
        ? posts.filter((p) => p.category === category)
        : posts;

  return (
    <section id="portfolio" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-1" role="group" aria-label="카드 크기">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setGridSize(size)}
                  aria-label={`${sizeConfig[size].label} 크기`}
                  aria-pressed={gridSize === size}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    gridSize === size
                      ? 'bg-foreground/10 text-foreground'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {sizeConfig[size].label}
                </button>
              ))}
            </div>
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
        </div>
        {tabCategories.length > 0 && (
          <div className="mt-6">
            <CategoryTabs
              categories={tabCategories}
              active={category}
              onChange={setCategory}
            />
          </div>
        )}
        {filtered.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? sizeConfig[gridSize].gridCols
                : sizeConfig[gridSize].listGap
            }
          >
            {filtered.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                variant={viewMode}
                gridSize={gridSize}
              />
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
