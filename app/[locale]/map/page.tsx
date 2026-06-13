import { getTranslations } from 'next-intl/server';
import { getMap } from '@/lib/db/settings';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('map') };
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const mapSettings = await getMap();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'نقشه و مسیر' : 'Map & How to Get Here'}
      </h1>

      {mapSettings.embedUrl ? (
        <div className="rounded-2xl overflow-hidden border border-primary/20 mb-6 aspect-video">
          <iframe
            src={mapSettings.embedUrl}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-primary-light border border-primary/20 aspect-video flex items-center justify-center mb-6">
          <p className="text-text-muted font-body text-sm">
            {isFa ? 'نقشه هنوز تنظیم نشده.' : 'Map not configured yet.'}
          </p>
        </div>
      )}

      {(mapSettings.directionsTextEn || mapSettings.directionsTextFa) && (
        <div className="bg-bg border border-primary/20 rounded-2xl p-5">
          <h2 className="font-heading text-lg font-semibold text-primary mb-3">
            {isFa ? 'راهنمای مسیر' : 'Directions'}
          </h2>
          <p className="font-body text-text leading-relaxed whitespace-pre-wrap">
            {isFa ? mapSettings.directionsTextFa : mapSettings.directionsTextEn}
          </p>
        </div>
      )}
    </div>
  );
}
