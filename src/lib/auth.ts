import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

export async function getUser(): Promise<User | null> {
  if (process.env.BYPASS_AUTH === 'true') {
    return {
      id: 'local-dev-user',
      email: process.env.ADMIN_EMAIL || 'admin@local.test',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '',
    } as User;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAdminUser(): Promise<User | null> {
  if (process.env.BYPASS_AUTH === 'true') {
    return getUser();
  }

  const user = await getUser();

  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || user.email !== adminEmail) return null;

  return user;
}
