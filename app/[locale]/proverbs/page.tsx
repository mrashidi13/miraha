import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getProverbs } from '@/lib/db/proverbs';
import { getServerUser } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('proverbs') };
}

export default async function ProverbsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ suggested?: string }>;
}) {
  const { locale } = await params;
  const { suggested } = await searchParams;
  const isFa = locale === 'fa';

  const [proverbs, user] = await Promise.all([getProverbs('approved'), getServerUser()]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'ضرب‌المثل‌ها' : 'Proverbs'}
        </h1>
        {user && (
          <Link
            href="/proverbs/suggest"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
          >
            {isFa ? '+ پیشنهاد ضرب‌المثل' : '+ Suggest a Proverb'}
          </Link>
        )}
      </div>

      {suggested === '1' && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm font-body text-accent">
          {isFa
            ? 'ضرب‌المثل شما ارسال شد و پس از بررسی مدیر منتشر خواهد شد.'
            : 'Your proverb was submitted and will appear after admin review. Thank you!'}
        </div>
      )}

      {proverbs.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'ضرب‌المثلی ثبت نشده.' : 'No proverbs yet.'}</p>
      ) : (
        <div className="space-y-6">
          {proverbs.map((p) => (
            <Link
              key={p.id}
              href={`/proverbs/${p.id}`}
              className="block bg-primary-light border border-primary/20 rounded-2xl p-5 hover:border-primary/60 transition-colors"
            >
              <p className="font-heading text-lg font-semibold text-primary mb-2">
                {isFa ? p.textFa : p.textEn}
              </p>
              <p className="text-sm text-text font-body">
                {isFa ? p.meaningFa : p.meaningEn}
              </p>
            </Link>
          ))}
        </div>
      )}

      {!user && (
        <p className="text-center text-sm text-text-muted font-body mt-10">
          <Link href="/login" className="text-accent hover:underline">
            {isFa ? 'وارد شوید' : 'Sign in'}
          </Link>{' '}
          {isFa ? 'تا ضرب‌المثل پیشنهاد دهید.' : 'to suggest a proverb.'}
        </p>
      )}
    </div>
  );
}
