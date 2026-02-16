import { createClient } from '@/lib/supabase/server';

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value');

  if (error || !data) {
    return {};
  }

  return Object.fromEntries(data.map(({ key, value }) => [key, value ?? '']));
}
