import type { Database } from '@/types/database';

export type FeaturedContent =
  Database['public']['Tables']['featured_content']['Row'];
export type FeaturedContentInsert =
  Database['public']['Tables']['featured_content']['Insert'];
export type FeaturedContentUpdate =
  Database['public']['Tables']['featured_content']['Update'];
