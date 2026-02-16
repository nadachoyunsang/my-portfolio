import { createClient } from '@/lib/supabase/server';

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export async function getCategories(): Promise<CategoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, sort_order')
    .order('sort_order');

  if (error || !data) return [];
  return data;
}
