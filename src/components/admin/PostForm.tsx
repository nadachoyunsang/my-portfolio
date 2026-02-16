'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TiptapEditor from '@/components/admin/TiptapEditor';
import Button from '@/components/ui/Button';
import { uploadImage } from '@/lib/image';
import { generateSlug } from '@/lib/slug';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types/database';

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    thumbnail_url: string | null;
    category: Category;
    tags: string[];
    published: boolean;
  };
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: '다큐멘터리', value: 'documentary' },
  { label: '책', value: 'book' },
  { label: '기사', value: 'article' },
];

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [category, setCategory] = useState<Category>(
    post?.category ?? 'article',
  );
  const [tagsInput, setTagsInput] = useState(post?.tags.join(', ') ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const supabase = createClient();
      const url = await uploadImage(supabase, file, 600, 'thumbnails');
      setThumbnailUrl(url);
    } catch {
      alert('썸네일 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      thumbnail_url: thumbnailUrl || null,
      category,
      tags,
      published,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const { error } = isEdit
      ? await client.from('posts').update(postData).eq('id', post.id)
      : await client.from('posts').insert(postData);

    setSaving(false);

    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">
            태그 (쉼표 구분)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="태그1, 태그2"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">요약</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">썸네일</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="text-sm text-muted"
          />
          {thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt="썸네일 미리보기"
              className="h-16 w-16 rounded object-cover"
            />
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">본문</label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="published" className="text-sm">
          공개
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? '저장 중...' : isEdit ? '수정' : '작성'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/posts')}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
