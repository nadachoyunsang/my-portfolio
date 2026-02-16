'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-foreground"
    >
      로그아웃
    </button>
  );
}
