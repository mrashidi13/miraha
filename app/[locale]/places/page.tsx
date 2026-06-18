import { getTranslations } from 'next-intl/server';
import { getPlaces } from '@/lib/db/places';
import { PlacesMap } from '@/components/ui/PlacesMap';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('places') };
}

export default async function PlacesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const places = await getPlaces();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <PlacesMap places={places} locale={locale} />
    </div>
  );
}
