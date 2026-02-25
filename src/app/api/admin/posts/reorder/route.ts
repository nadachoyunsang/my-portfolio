import { NextResponse } from 'next/server';

import { getAdminUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const orders: { id: string; sort_order: number }[] = body.orders;

  if (!Array.isArray(orders) || orders.length === 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const results = await Promise.all(
    orders.map(({ id, sort_order }) =>
      client.from('posts').update({ sort_order }).eq('id', id),
    ),
  );

  const error = results.find((r) => r.error)?.error;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
