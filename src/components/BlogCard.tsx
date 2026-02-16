import Image from 'next/image';

import type { PostSummary } from '@/lib/posts';

interface BlogCardProps {
  post: PostSummary;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-card"
    >
      {post.thumbnail_url && (
        <Image
          src={post.thumbnail_url}
          alt={post.title}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-md object-cover"
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
    </a>
  );
}
