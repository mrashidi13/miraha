import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import { actionSignOut } from '@/app/actions/auth';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const supabaseUser = await getServerUser();
  if (!supabaseUser) redirect(`/${locale}/login`);

  const dbUser = await getUserById(supabaseUser.id);

  const signOutWithLocale = actionSignOut.bind(null, locale);

  return (
    <div className="max-w-lg mx-auto px-4 py-12 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'پروفایل' : 'Profile'}
      </h1>

      <div className="bg-bg border border-primary/20 rounded-2xl p-6 space-y-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          {dbUser?.avatarUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image src={dbUser.avatarUrl} alt={dbUser.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
              <span className="font-heading text-2xl font-bold text-primary">
                {(dbUser?.name ?? supabaseUser.email ?? '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-heading font-semibold text-primary text-lg">
              {dbUser?.name ?? supabaseUser.email?.split('@')[0]}
            </p>
            <p className="text-sm text-text-muted font-body">{supabaseUser.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-body ${
              dbUser?.role === 'admin'
                ? 'bg-accent/20 text-accent'
                : 'bg-primary-light text-primary'
            }`}>
              {dbUser?.role ?? 'member'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-primary/10">
          <a
            href={`/${locale}/profile/favorites`}
            className="text-sm font-body text-primary hover:underline"
          >
            {isFa ? '♥ واژه‌های ذخیره‌شده' : '♥ Favorite Words'}
          </a>
        </div>

        {dbUser?.role === 'admin' && (
          <div className="pt-2 border-t border-primary/10">
            <a
              href={`/${locale}/admin`}
              className="text-sm font-body text-accent hover:underline"
            >
              {isFa ? '→ رفتن به پنل مدیریت' : '→ Go to Admin Panel'}
            </a>
          </div>
        )}

        {/* Sign out */}
        <div className="pt-2 border-t border-primary/10">
          <form action={signOutWithLocale}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-body hover:bg-red-50 transition-colors"
            >
              {isFa ? 'خروج از حساب' : 'Sign out'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
