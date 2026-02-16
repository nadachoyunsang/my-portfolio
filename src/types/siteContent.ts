import type { Database } from '@/types/database';

export type SiteContent = Database['public']['Tables']['site_content']['Row'];
export type SiteContentInsert =
  Database['public']['Tables']['site_content']['Insert'];
export type SiteContentUpdate =
  Database['public']['Tables']['site_content']['Update'];
