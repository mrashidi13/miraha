import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllNews } from '@/lib/db/news';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('news') };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const news = await getAllNews();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'اخبار' : 'News'}
      </h1>

      {news.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'خبری ثبت نشده.' : 'No news yet.'}</p>
      ) : (
        <div className="space-y-5">
          {news.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.id}`}
              className="block bg-bg border border-primary/20 rounded-2xl p-5 hover:border-primary/60 transition-colors"
            >
              <p className="text-xs text-text-muted font-body mb-2">
                {new Date(n.publishedAt).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <h2 className="font-heading text-lg font-semibold text-primary">
                {isFa ? n.titleFa : n.titleEn}
              </h2>
              <p className="text-sm text-text font-body mt-2 line-clamp-3">
                {isFa ? n.bodyFa : n.bodyEn}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
