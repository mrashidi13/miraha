import { getTranslations } from 'next-intl/server';
import { getMedia } from '@/lib/db/media';
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
  const media = await getMedia();
  const photos = media.filter((m) => m.type === 'photo');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'گالری' : 'Gallery'}
      </h1>

      {photos.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'تصویری ثبت نشده.' : 'No photos yet.'}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((m) => (
            <div key={m.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-primary/20">
              <Image src={m.url} alt={isFa ? (m.captionFa ?? '') : (m.captionEn ?? '')} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
