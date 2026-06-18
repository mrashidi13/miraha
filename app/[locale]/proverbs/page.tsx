import { getTranslations } from 'next-intl/server';
import { getProverbs } from '@/lib/db/proverbs';
import { getServerUser } from '@/lib/supabase/server';
import { ProverbSearch } from '@/components/ui/ProverbSearch';
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
      {suggested === '1' && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm font-body text-accent">
          {isFa
            ? 'ضرب‌المثل شما ارسال شد و پس از بررسی مدیر منتشر خواهد شد.'
            : 'Your proverb was submitted and will appear after admin review. Thank you!'}
        </div>
      )}

      <ProverbSearch
        proverbs={proverbs}
        locale={locale}
        showSuggest={!!user}
        suggestHref={`/proverbs/suggest`}
      />

      {!user && (
        <p className="text-center text-sm text-text-muted font-body mt-10">
          <a href={isFa ? '/login' : '/en/login'} className="text-accent hover:underline">
            {isFa ? 'وارد شوید' : 'Sign in'}
          </a>{' '}
          {isFa ? 'تا ضرب‌المثل پیشنهاد دهید.' : 'to suggest a proverb.'}
        </p>
      )}
    </div>
  );
}
