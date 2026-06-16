import { getTranslations } from 'next-intl/server';
import { getPeople } from '@/lib/db/people';
import { PeopleSearch } from '@/components/ui/PeopleSearch';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('people') };
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const people = await getPeople();
  const familyTreeHref = '/family-tree';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <PeopleSearch people={people} locale={locale} familyTreeHref={familyTreeHref} />
    </div>
  );
}
