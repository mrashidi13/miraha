import { getTranslations } from 'next-intl/server';
import { getPeopleWithRelations } from '@/lib/db/people';
import { PeopleView } from '@/components/ui/PeopleView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('people') };
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const people = await getPeopleWithRelations();

  return <PeopleView people={people} locale={locale} />;
}
