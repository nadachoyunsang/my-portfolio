import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

function sanitizeRedirectPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return '/';
  }
  return path;
}

export async function GET(request: Request) {
  const { searchParams, origin: urlOrigin } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const origin = forwardedHost ? `https://${forwardedHost}` : urlOrigin;

  const code = searchParams.get('code');
  const next = sanitizeRedirectPath(searchParams.get('next') ?? '/');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback`);
}
