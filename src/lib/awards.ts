import { createClient } from '@/lib/supabase/server';
import type { Award } from '@/types/award';

export async function getAwards(): Promise<Award[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .order('year', { ascending: false });

  if (error || !data) return [];
  return data;
}
