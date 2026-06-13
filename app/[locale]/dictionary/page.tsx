import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getWords } from '@/lib/db/words';
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
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const isFa = locale === 'fa';

  const words = await getWords({ search: q, status: 'approved' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-6">
        {isFa ? 'واژه‌نامه' : 'Dictionary'}
      </h1>

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
    </div>
  );
}
