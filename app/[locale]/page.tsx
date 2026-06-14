import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { LiveSearch } from '@/components/ui/LiveSearch';
import { getHero, getMap } from '@/lib/db/settings';
import { getWords } from '@/lib/db/words';
import { getProverbs } from '@/lib/db/proverbs';
import { getAllNews } from '@/lib/db/news';
import { getMedia } from '@/lib/db/media';
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

  const [hero, words, proverbs, news, photos, mapSettings] = await Promise.all([
    getHero(),
    getWords({ status: 'approved' }),
    getProverbs('approved'),
    getAllNews(),
    getMedia('photo'),
    getMap(),
  ]);

  const featuredNews = news.slice(0, 3);
  const featuredPhotos = photos.slice(0, 6);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSlideshow
        images={hero.imageUrls}
        eyebrow={isFa ? hero.eyebrowFa : hero.eyebrowEn}
        title={isFa ? hero.titleFa : hero.titleEn}
        subtitle={isFa ? hero.subtitleFa : hero.subtitleEn}
      />

      {/* ── Quick nav ─────────────────────────────────────────────────────── */}
      <section className="bg-bg py-8 px-4 border-b border-primary/10">
        <div className="max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { href: '/dictionary', en: 'Dictionary', fa: 'واژه‌نامه', icon: '📖' },
            { href: '/proverbs',   en: 'Proverbs',   fa: 'ضرب‌المثل', icon: '💬' },
            { href: '/news',       en: 'News',        fa: 'اخبار',      icon: '📰' },
            { href: '/gallery',    en: 'Gallery',     fa: 'گالری',      icon: '🖼️' },
            { href: '/events',     en: 'Events',      fa: 'رویدادها',   icon: '📅' },
            { href: '/people',     en: 'People',      fa: 'مردم',       icon: '👥' },
            { href: '/map',        en: 'Map',         fa: 'نقشه',       icon: '🗺️' },
            { href: '/about',      en: 'About',       fa: 'درباره',     icon: 'ℹ️' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href as Parameters<typeof Link>[0]['href']}
              className="flex flex-col items-center gap-1 rounded-xl py-3 px-1 text-center hover:bg-primary-light transition-colors group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-body text-text-muted group-hover:text-primary transition-colors leading-tight">
                {isFa ? item.fa : item.en}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Live search: Dictionary + Proverbs ───────────────────────────── */}
      <LiveSearch words={words} proverbs={proverbs} locale={locale} />

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="bg-bg py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              en="Gallery"
              fa="گالری"
              subEn="Moments from village life, across seasons and generations"
              subFa="لحظاتی از زندگی روستا، در فصل‌ها و نسل‌های مختلف"
              isFa={isFa}
              href="/gallery"
              linkEn="View all photos"
              linkFa="همه عکس‌ها"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featuredPhotos.map((p) => (
                <Link
                  key={p.id}
                  href="/gallery"
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <Image
                    src={p.url}
                    alt={(isFa ? p.captionFa : p.captionEn) ?? ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {(p.captionEn || p.captionFa) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs font-body">
                        {isFa ? p.captionFa : p.captionEn}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── News ─────────────────────────────────────────────────────────── */}
      {featuredNews.length > 0 && (
        <section className="bg-primary-light py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              en="Latest News"
              fa="آخرین اخبار"
              subEn="Updates from the village and the diaspora community"
              subFa="اخبار از روستا و جامعه مهاجران"
              isFa={isFa}
              href="/news"
              linkEn="Read all news"
              linkFa="همه اخبار"
            />
            <div className="grid sm:grid-cols-3 gap-5">
              {featuredNews.map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="bg-bg rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-sm transition-all overflow-hidden group"
                >
                  {n.imageUrl && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={n.imageUrl}
                        alt={isFa ? n.titleFa : n.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-text-muted font-body mb-2">
                      {new Date(n.publishedAt).toLocaleDateString(
                        isFa ? 'fa-IR' : 'en-GB',
                        { year: 'numeric', month: 'long', day: 'numeric' },
                      )}
                    </p>
                    <h3 className="font-heading font-semibold text-primary text-base leading-snug mb-2">
                      {isFa ? n.titleFa : n.titleEn}
                    </h3>
                    <p className="text-sm text-text-muted font-body line-clamp-3">
                      {isFa ? n.bodyFa : n.bodyEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Location ─────────────────────────────────────────────────────── */}
      <section className="bg-bg py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            en="Find Us"
            fa="موقعیت روستا"
            subEn="Located in the heart of the desert — here is how to reach us"
            subFa="در دل بیابان — اینجاست که ما هستیم"
            isFa={isFa}
            href="/map"
            linkEn="Full map & directions"
            linkFa="نقشه کامل و مسیر"
          />

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Map embed or placeholder */}
            <div className="rounded-2xl overflow-hidden border border-primary/20 aspect-video bg-primary-light">
              {mapSettings.embedUrl ? (
                <iframe
                  src={mapSettings.embedUrl}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isFa ? 'نقشه روستا' : 'Village map'}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-muted">
                  <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="font-body text-sm">
                    {isFa ? 'نقشه در پنل مدیریت تنظیم می‌شود' : 'Map configured from admin panel'}
                  </p>
                  <Link
                    href="/admin/settings"
                    className="text-xs text-accent hover:underline font-body"
                  >
                    {isFa ? 'تنظیم نقشه ←' : 'Set map URL →'}
                  </Link>
                </div>
              )}
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              {/* Directions */}
              {(mapSettings.directionsTextEn || mapSettings.directionsTextFa) && (
                <div className="bg-primary-light rounded-2xl p-5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-heading text-sm font-semibold text-primary">
                      {isFa ? 'راهنمای مسیر' : 'Directions'}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-text leading-relaxed whitespace-pre-wrap">
                    {isFa ? mapSettings.directionsTextFa : mapSettings.directionsTextEn}
                  </p>
                </div>
              )}

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
                  <p className="text-xs text-text-muted font-body mb-1 uppercase tracking-wider">
                    {isFa ? 'منطقه' : 'Region'}
                  </p>
                  <p className="font-heading text-sm font-semibold text-primary">
                    {isFa ? 'ایران' : 'Iran'}
                  </p>
                </div>
                <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
                  <p className="text-xs text-text-muted font-body mb-1 uppercase tracking-wider">
                    {isFa ? 'نوع' : 'Type'}
                  </p>
                  <p className="font-heading text-sm font-semibold text-primary">
                    {isFa ? 'روستای بیابانی' : 'Desert village'}
                  </p>
                </div>
                <div className="bg-primary-light rounded-xl p-4 border border-primary/20 col-span-2">
                  <p className="text-xs text-text-muted font-body mb-1 uppercase tracking-wider">
                    {isFa ? 'آب‌رسانی' : 'Water source'}
                  </p>
                  <p className="font-heading text-sm font-semibold text-primary">
                    {isFa ? 'قنات باستانی' : 'Ancient qanat system'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

function SectionHeader({
  en, fa, subEn, subFa, isFa, href, linkEn, linkFa,
}: {
  en: string; fa: string;
  subEn: string; subFa: string;
  isFa: boolean;
  href: string;
  linkEn: string; linkFa: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
          {isFa ? fa : en}
        </h2>
        <p className="text-sm text-text-muted font-body mt-1">
          {isFa ? subFa : subEn}
        </p>
      </div>
      <Link
        href={href as Parameters<typeof Link>[0]['href']}
        className="flex-shrink-0 text-sm text-accent font-body hover:underline"
      >
        {isFa ? `← ${linkFa}` : `${linkEn} →`}
      </Link>
    </div>
  );
}
