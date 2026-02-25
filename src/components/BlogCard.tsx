import Image from 'next/image';
import Link from 'next/link';

import type { PostSummary } from '@/lib/posts';

type BlogCardVariant = 'grid' | 'list';

interface BlogCardProps {
  post: PostSummary;
  variant?: BlogCardVariant;
}

export default function BlogCard({ post, variant = 'grid' }: BlogCardProps) {
  if (variant === 'grid') {
    return (
      <Link
        href={`/portfolio/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:bg-card"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-foreground/5">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted/40">
              <svg
                width="48"
                height="48"
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
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted"
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

  return (
    <Link
      href={`/portfolio/${post.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-card sm:flex-row sm:gap-4"
    >
      {post.thumbnail_url && (
        <Image
          src={post.thumbnail_url}
          alt=""
          width={96}
          height={96}
          className="h-40 w-full shrink-0 rounded-md object-cover sm:h-24 sm:w-24"
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted"
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
