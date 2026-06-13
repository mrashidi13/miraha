import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { getFavoritesByUser } from '@/lib/db/favorites';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Favorites' };

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const user = await getServerUser();
  if (!user) redirect(`/${locale}/login`);

  const favorites = await getFavoritesByUser(user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-sm text-accent hover:underline font-body">
          ← {isFa ? 'پروفایل' : 'Profile'}
        </Link>
      </div>

      <h1 className="font-heading text-2xl font-bold text-primary mb-6">
        {isFa ? 'واژه‌های علاقه‌مندی‌ها' : 'Favorite Words'}
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted font-body mb-4">
            {isFa ? 'هنوز واژه‌ای ذخیره نکرده‌اید.' : "You haven't saved any words yet."}
          </p>
          <Link
            href="/dictionary"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
          >
            {isFa ? 'رفتن به واژه‌نامه' : 'Browse the Dictionary'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map(({ word }) => (
            <Link
              key={word.id}
              href={`/dictionary/${word.id}`}
              className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3 hover:border-primary/60 transition-colors"
            >
              <div>
                <span className="font-heading font-semibold text-primary">{word.term}</span>
                {word.pronunciation && (
                  <span className="text-xs text-text-muted font-body ml-2">
                    /{word.pronunciation}/
                  </span>
                )}
                <p className="text-sm text-text font-body mt-0.5">
                  {isFa ? word.meaningFa : word.meaningEn}
                </p>
              </div>
              <span className="text-accent text-lg leading-none ml-3 flex-shrink-0">♥</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
