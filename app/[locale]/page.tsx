import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { LiveSearch } from '@/components/ui/LiveSearch';
import { getHeroWithSlides, getMap } from '@/lib/db/settings';
import { getWords } from '@/lib/db/words';
import { getProverbs } from '@/lib/db/proverbs';
import { getAllNews } from '@/lib/db/news';
import { getMedia } from '@/lib/db/media';
import { getAlbums } from '@/lib/db/albums';
import { getActiveAnnouncements } from '@/lib/db/announcements';
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

  const [hero, words, proverbs, news, photos, albums, mapSettings, announcements] = await Promise.all([
    getHeroWithSlides(),
    getWords({ status: 'approved' }),
    getProverbs('approved'),
    getAllNews(),
    getMedia('photo'),
    getAlbums(),
    getMap(),
    getActiveAnnouncements(),
  ]);

  const featuredNews = news.slice(0, 3);
  const featuredPhotos = photos.slice(0, 6);
  const featuredAlbums = albums.slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSlideshow
        slides={hero.slides}
        rotationInterval={hero.rotationInterval}
        locale={locale}
        legacyImages={hero.imageUrls}
        legacyEyebrow={isFa ? hero.eyebrowFa : hero.eyebrowEn}
        legacyTitle={isFa ? hero.titleFa : hero.titleEn}
        legacySubtitle={isFa ? hero.subtitleFa : hero.subtitleEn}
      />

      {/* ── Announcements ────────────────────────────────────────────────── */}
      {announcements.length > 0 && (
        <section className="bg-bg px-4 pt-6 pb-2">
          <div className="max-w-4xl mx-auto space-y-3">
            {announcements.map((a) => {
              const isUrgent = a.type === 'urgent';
              const isDeath = a.type === 'death';
              const bg = isUrgent
                ? 'bg-amber-50 border-amber-300'
                : isDeath
                ? 'bg-red-50 border-red-300'
                : 'bg-primary-light border-primary/30';
              const textColor = isUrgent
                ? 'text-amber-800'
                : isDeath
                ? 'text-red-800'
                : 'text-primary';
              const badge = isUrgent
                ? (isFa ? 'فوری' : 'Urgent')
                : isDeath
                ? (isFa ? 'درگذشت' : 'Death Notice')
                : (isFa ? 'اطلاعیه' : 'Notice');
              const badgeBg = isUrgent
                ? 'bg-amber-200 text-amber-800'
                : isDeath
                ? 'bg-red-200 text-red-800'
                : 'bg-primary/10 text-primary';
              return (
                <div key={a.id} className={`rounded-2xl border px-5 py-4 ${bg}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 text-xs font-body font-semibold px-2 py-0.5 rounded-full mt-0.5 ${badgeBg}`}>
                      {badge}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-heading font-semibold ${textColor}`}>
                        {isFa ? a.titleFa : a.titleEn}
                      </p>
                      {(a.bodyEn || a.bodyFa) && (
                        <p className={`text-sm font-body mt-1 ${textColor} opacity-80`}>
                          {isFa ? a.bodyFa : a.bodyEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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

      {/* ── Latest Albums ─────────────────────────────────────────────────── */}
      {featuredAlbums.length > 0 && (
        <section className="bg-bg py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              en="Latest Albums"
              fa="آخرین آلبوم‌ها"
              subEn="Collections of moments from village life"
              subFa="مجموعه‌ای از لحظات زندگی روستا"
              isFa={isFa}
              href="/gallery"
              linkEn="All albums"
              linkFa="همه آلبوم‌ها"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {featuredAlbums.map((album) => {
                const cover = album.coverUrl ?? album.media[0]?.url;
                return (
                  <Link
                    key={album.id}
                    href={`/gallery/album/${album.id}`}
                    className="group rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-md transition-all bg-bg"
                  >
                    <div className="relative aspect-[4/3] bg-primary-light">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={isFa ? album.titleFa : album.titleEn}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/30 text-3xl">🖼️</div>
                      )}
                      <span className="absolute top-2 end-2 bg-black/60 text-white text-xs font-body px-2 py-0.5 rounded-full">
                        {album._count.media} {isFa ? 'تصویر' : 'photos'}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="font-heading font-semibold text-primary text-sm group-hover:text-primary/80 transition-colors">
                        {isFa ? album.titleFa : album.titleEn}
                      </p>
                      {(album.descriptionEn || album.descriptionFa) && (
                        <p className="text-xs text-text-muted font-body mt-0.5 line-clamp-1">
                          {isFa ? album.descriptionFa : album.descriptionEn}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Photos ─────────────────────────────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="bg-primary-light py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              en="Latest Photos"
              fa="آخرین تصاویر"
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
