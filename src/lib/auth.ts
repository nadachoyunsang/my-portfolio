import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAdminUser(): Promise<User | null> {
  const user = await getUser();

  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || user.email !== adminEmail) return null;

  return user;
}
