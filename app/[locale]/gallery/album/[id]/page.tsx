import { notFound } from 'next/navigation';
import { getAlbum } from '@/lib/db/albums';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const album = await getAlbum(id);
  return { title: album?.titleEn ?? 'Album' };
}

export default async function AlbumPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const isFa = locale === 'fa';

  const album = await getAlbum(id);
  if (!album) notFound();

  const photos = album.media.filter((m) => m.type === 'photo');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <Link
        href="/gallery"
        className="text-sm text-accent hover:underline font-body mb-6 inline-block"
      >
        {isFa ? '← گالری' : '← Gallery'}
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? album.titleFa : album.titleEn}
        </h1>
        {(album.descriptionEn || album.descriptionFa) && (
          <p className="text-text-muted font-body mt-2 leading-relaxed">
            {isFa ? album.descriptionFa : album.descriptionEn}
          </p>
        )}
        <p className="text-xs text-text-muted font-body mt-1">
          {photos.length} {isFa ? 'تصویر' : photos.length === 1 ? 'photo' : 'photos'}
        </p>
      </div>

      {photos.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'تصویری در این آلبوم نیست.' : 'No photos in this album yet.'}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((m) => (
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
      )}
    </div>
  );
}
