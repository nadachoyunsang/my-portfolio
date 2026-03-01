import type { Database } from '@/types/database';

export type Award = Database['public']['Tables']['awards']['Row'];
export type AwardInsert = Database['public']['Tables']['awards']['Insert'];
export type AwardUpdate = Database['public']['Tables']['awards']['Update'];
