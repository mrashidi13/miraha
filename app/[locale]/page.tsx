import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { getHero } from '@/lib/db/settings';
import { getWords } from '@/lib/db/words';
import { getAllNews } from '@/lib/db/news';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return { title: t('name') };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const [hero, recentWords, recentNews] = await Promise.all([
    getHero(),
    getWords({ status: 'approved' }),
    getAllNews(),
  ]);

  return (
    <>
      <HeroSlideshow
        images={hero.imageUrls}
        eyebrow={isFa ? hero.eyebrowFa : hero.eyebrowEn}
        title={isFa ? hero.titleFa : hero.titleEn}
        subtitle={isFa ? hero.subtitleFa : hero.subtitleEn}
      />

      {/* Quick nav */}
      <section className="bg-bg py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NavCard href="/dictionary" label={isFa ? 'واژه‌نامه' : 'Dictionary'} />
          <NavCard href="/proverbs" label={isFa ? 'ضرب‌المثل‌ها' : 'Proverbs'} />
          <NavCard href="/news" label={isFa ? 'اخبار' : 'News'} />
          <NavCard href="/gallery" label={isFa ? 'گالری' : 'Gallery'} />
          <NavCard href="/events" label={isFa ? 'رویدادها' : 'Events'} />
          <NavCard href="/people" label={isFa ? 'مردم' : 'People'} />
          <NavCard href="/map" label={isFa ? 'نقشه' : 'Map'} />
          <NavCard href="/about" label={isFa ? 'درباره' : 'About'} />
        </div>
      </section>

      {/* Recent words */}
      {recentWords.length > 0 && (
        <section className="bg-primary-light py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-6">
              {isFa ? 'واژه‌های اخیر' : 'Recent Words'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recentWords.slice(0, 4).map((w) => (
                <Link
                  key={w.id}
                  href={`/dictionary/${w.id}`}
                  className="bg-bg rounded-xl p-4 border border-primary/20 hover:border-primary/60 transition-colors"
                >
                  <p className="font-heading text-lg text-primary font-semibold">{w.term}</p>
                  <p className="text-sm text-text-muted font-body mt-1">
                    {isFa ? w.meaningFa : w.meaningEn}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-end">
              <Link href="/dictionary" className="text-sm text-accent font-body hover:underline">
                {isFa ? 'همه واژه‌ها ←' : '← All words'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent news */}
      {recentNews.length > 0 && (
        <section className="bg-bg py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-6">
              {isFa ? 'آخرین اخبار' : 'Latest News'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recentNews.slice(0, 2).map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="bg-primary-light rounded-xl p-4 border border-primary/20 hover:border-primary/60 transition-colors"
                >
                  <p className="font-heading text-base font-semibold text-primary">
                    {isFa ? n.titleFa : n.titleEn}
                  </p>
                  <p className="text-sm text-text-muted font-body mt-1 line-clamp-2">
                    {isFa ? n.bodyFa : n.bodyEn}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function NavCard({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as Parameters<typeof Link>[0]['href']}
      className="flex items-center justify-center rounded-xl border border-primary/30 bg-primary-light py-5 px-3 text-center text-sm font-body font-medium text-primary hover:bg-primary/10 transition-colors"
    >
      {label}
    </Link>
  );
}
