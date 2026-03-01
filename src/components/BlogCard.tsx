import Image from 'next/image';
import Link from 'next/link';

import type { PostSummary } from '@/lib/posts';

type BlogCardVariant = 'grid' | 'list';
export type GridSize = 'sm' | 'md' | 'lg';

const gridStyles: Record<
  GridSize,
  { title: string; excerpt: string; tag: string; padding: string; icon: number }
> = {
  sm: {
    title: 'text-sm font-semibold',
    excerpt: 'text-xs',
    tag: 'text-[10px] px-1.5 py-0.5',
    padding: 'p-3',
    icon: 32,
  },
  md: {
    title: 'text-base font-semibold',
    excerpt: 'text-sm',
    tag: 'text-xs px-2 py-0.5',
    padding: 'p-4',
    icon: 48,
  },
  lg: {
    title: 'text-lg font-semibold',
    excerpt: 'text-base',
    tag: 'text-sm px-2.5 py-0.5',
    padding: 'p-5',
    icon: 56,
  },
};

const listStyles: Record<
  GridSize,
  {
    container: string;
    title: string;
    excerpt: string;
    tag: string;
    thumbClass: string;
    thumbW: number;
    thumbH: number;
  }
> = {
  sm: {
    container:
      'group flex flex-row gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-card',
    title: 'text-sm font-semibold',
    excerpt: 'text-xs',
    tag: 'text-[10px] px-1.5 py-0.5',
    thumbClass: 'h-16 w-16 shrink-0 rounded-md object-cover',
    thumbW: 64,
    thumbH: 64,
  },
  md: {
    container:
      'group flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-card sm:flex-row sm:gap-4',
    title: 'font-semibold',
    excerpt: 'text-sm',
    tag: 'text-xs px-2 py-0.5',
    thumbClass: 'h-40 w-full shrink-0 rounded-md object-cover sm:h-24 sm:w-24',
    thumbW: 96,
    thumbH: 96,
  },
  lg: {
    container:
      'group flex flex-col gap-4 rounded-lg border border-border p-5 transition-colors hover:bg-card sm:flex-row sm:gap-5',
    title: 'text-lg font-semibold',
    excerpt: 'text-base',
    tag: 'text-sm px-2.5 py-0.5',
    thumbClass: 'h-48 w-full shrink-0 rounded-md object-cover sm:h-32 sm:w-32',
    thumbW: 128,
    thumbH: 128,
  },
};

interface BlogCardProps {
  post: PostSummary;
  variant?: BlogCardVariant;
  gridSize?: GridSize;
}

export default function BlogCard({
  post,
  variant = 'grid',
  gridSize = 'md',
}: BlogCardProps) {
  if (variant === 'grid') {
    const styles = gridStyles[gridSize];

    return (
      <Link
        href={`/portfolio/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:bg-card"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-foreground/5">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted/40">
              <svg
                width={styles.icon}
                height={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
        <div className={`flex flex-1 flex-col ${styles.padding}`}>
          <h3
            className={`${styles.title} group-hover:text-accent transition-colors`}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p className={`mt-1 line-clamp-2 ${styles.excerpt} text-muted`}>
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full bg-foreground/5 ${styles.tag} text-muted`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  const ls = listStyles[gridSize];

  return (
    <Link href={`/portfolio/${post.slug}`} className={ls.container}>
      {post.thumbnail_url && (
        <Image
          src={post.thumbnail_url}
          alt=""
          width={ls.thumbW}
          height={ls.thumbH}
          className={ls.thumbClass}
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className={`${ls.title} group-hover:text-accent transition-colors`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`mt-1 line-clamp-2 ${ls.excerpt} text-muted`}>
            {post.excerpt}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full bg-foreground/5 ${ls.tag} text-muted`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
