import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getWords } from '@/lib/db/words';
import { getServerUser } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('dictionary') };
}

export default async function DictionaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; suggested?: string }>;
}) {
  const { locale } = await params;
  const { q, suggested } = await searchParams;
  const isFa = locale === 'fa';

  const [words, user] = await Promise.all([
    getWords({ search: q, status: 'approved' }),
    getServerUser(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'واژه‌نامه' : 'Dictionary'}
        </h1>
        {user && (
          <Link
            href="/dictionary/suggest"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
          >
            {isFa ? '+ پیشنهاد واژه' : '+ Suggest a Word'}
          </Link>
        )}
      </div>

      {suggested === '1' && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm font-body text-accent">
          {isFa
            ? 'واژه شما ارسال شد و پس از بررسی مدیر منتشر خواهد شد.'
            : 'Your word was submitted and will appear after admin review. Thank you!'}
        </div>
      )}

      {/* Search */}
      <form className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder={isFa ? 'جستجو…' : 'Search words…'}
            className="flex-1 rounded-lg border border-primary/30 px-4 py-2 font-body text-sm bg-bg focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-accent text-white font-body text-sm hover:bg-accent-hover transition-colors"
          >
            {isFa ? 'جستجو' : 'Search'}
          </button>
        </div>
      </form>

      {words.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'نتیجه‌ای یافت نشد.' : 'No words found.'}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {words.map((w) => (
            <Link
              key={w.id}
              href={`/dictionary/${w.id}`}
              className="bg-bg border border-primary/20 rounded-xl p-4 hover:border-primary/60 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-heading text-lg font-semibold text-primary">{w.term}</span>
                {w.pronunciation && (
                  <span className="text-xs text-text-muted font-body">/{w.pronunciation}/</span>
                )}
              </div>
              <p className="text-sm text-text font-body mt-1">
                {isFa ? w.meaningFa : w.meaningEn}
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
          {isFa ? 'تا واژه پیشنهاد دهید.' : 'to suggest a word.'}
        </p>
      )}
    </div>
  );
}
