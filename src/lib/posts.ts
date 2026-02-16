import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/types/database';

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  category: Category;
  tags: string[];
  created_at: string;
};

export async function getPublishedPosts(
  category?: Category,
): Promise<PostSummary[]> {
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, thumbnail_url, category, tags, created_at',
    )
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data;
}

export type PostDetail = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  thumbnail_url: string | null;
  category: Category;
  tags: string[];
  created_at: string;
};

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, slug, content, excerpt, thumbnail_url, category, tags, created_at',
    )
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
