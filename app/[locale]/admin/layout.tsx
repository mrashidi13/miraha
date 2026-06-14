import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/words', label: 'Words' },
  { href: '/admin/proverbs', label: 'Proverbs' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/albums', label: 'Albums' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/people', label: 'People' },
  { href: '/admin/hero', label: 'Hero' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/appearance', label: 'Appearance' },
  { href: '/admin/users', label: 'Users' },
] as const;

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ── Auth gate ──────────────────────────────────────────────────────────────
  const supabaseUser = await getServerUser();

  if (!supabaseUser) {
    redirect(`/${locale}/login?next=/${locale}/admin`);
  }

  const dbUser = await getUserById(supabaseUser.id);

  if (!dbUser || dbUser.role !== 'admin') {
    // Authenticated but not an admin → bounce to home with a message
    redirect(`/${locale}?error=not_admin`);
  }
  // ── End auth gate ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-e border-primary/20 bg-primary-light">
        <nav className="flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-x-visible">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-body text-text hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
