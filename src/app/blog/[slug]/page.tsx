import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPostBySlug } from '@/lib/posts';

const CATEGORY_LABEL: Record<string, string> = {
  documentary: '다큐멘터리',
  book: '책',
  article: '기사',
};

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: '글을 찾을 수 없습니다' };
  }

  return {
    title: `${post.title} | YJ-CJS`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/#blog"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; 목록으로
      </Link>

      <header className="mt-8">
        <span className="text-sm text-accent">
          {CATEGORY_LABEL[post.category] ?? post.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">{date}</p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.thumbnail_url && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.content && (
        <div
          className="prose-invert mt-12 max-w-none leading-relaxed [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_p]:text-foreground/85 [&_a]:text-accent [&_a]:underline [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_img]:rounded-lg [&_img]:my-6 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}
