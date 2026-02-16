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
