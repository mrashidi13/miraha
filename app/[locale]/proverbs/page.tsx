import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getProverbs } from '@/lib/db/proverbs';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('proverbs') };
}

export default async function ProverbsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const proverbs = await getProverbs('approved');

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'ضرب‌المثل‌ها' : 'Proverbs'}
      </h1>

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
    </div>
  );
}
