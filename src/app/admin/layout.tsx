import Link from 'next/link';
import { notFound } from 'next/navigation';

import LogoutButton from '@/components/LogoutButton';
import Container from '@/components/ui/Container';
import { ToastProvider } from '@/components/ui/Toast';
import { getAdminUser } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAdminUser();

  if (!user) notFound();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-neutral-800">
          <Container className="flex items-center justify-between py-4">
            <Link
              href="/admin"
              className="text-lg font-semibold text-foreground hover:text-accent transition-colors"
            >
              관리자
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">{user.email}</span>
              <LogoutButton />
            </div>
          </Container>
        </header>
        <Container as="main" className="py-8">
          {children}
        </Container>
      </div>
    </ToastProvider>
  );
}
