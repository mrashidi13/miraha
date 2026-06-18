import { getTranslations } from 'next-intl/server';
import { getSuperstitions } from '@/lib/db/superstitions';
import { SuperstitionSearch } from '@/components/ui/SuperstitionSearch';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('superstitions') };
}

export default async function SuperstitionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const superstitions = await getSuperstitions('approved');
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <SuperstitionSearch superstitions={superstitions} locale={locale} />
    </div>
  );
}
