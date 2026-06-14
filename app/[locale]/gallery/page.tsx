import { getTranslations } from 'next-intl/server';
import { getAlbums } from '@/lib/db/albums';
import { getMedia } from '@/lib/db/media';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('gallery') };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const [albums, allMedia] = await Promise.all([getAlbums(), getMedia('photo')]);
  const standalone = allMedia.filter((m) => !m.albumId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-10">
        {isFa ? 'گالری' : 'Gallery'}
      </h1>

      {/* ── Albums ── */}
      {albums.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-xl font-semibold text-primary mb-5">
            {isFa ? 'آلبوم‌ها' : 'Albums'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {albums.map((album) => {
              const cover = album.coverUrl ?? album.media[0]?.url;
              const count = album._count.media;
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
                        alt={(isFa ? album.titleFa : album.titleEn)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-2 end-2 bg-black/60 text-white text-xs font-body px-2 py-0.5 rounded-full">
                      {count} {isFa ? 'تصویر' : count === 1 ? 'photo' : 'photos'}
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
        </section>
      )}

      {/* ── All standalone photos ── */}
      {standalone.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-primary mb-5">
            {isFa ? 'تصاویر' : 'Photos'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {standalone.map((m) => (
              <div
                key={m.id}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-primary/20"
              >
                <Image
                  src={m.url}
                  alt={(isFa ? m.captionFa : m.captionEn) ?? ''}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {(m.captionEn || m.captionFa) && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-xs text-white font-body opacity-0 group-hover:opacity-100 transition-opacity">
                    {isFa ? m.captionFa : m.captionEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {albums.length === 0 && standalone.length === 0 && (
        <p className="text-text-muted font-body">{isFa ? 'تصویری ثبت نشده.' : 'No photos yet.'}</p>
      )}
    </div>
  );
}
