import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getPeopleWithRelations } from '@/lib/db/people';
import { getServerUser } from '@/lib/supabase/server';
import { PeopleView } from '@/components/ui/PeopleView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('people') };
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const user = await getServerUser();
  if (!user) {
    const loginPath = locale === 'en' ? '/en/login' : '/login';
    redirect(`${loginPath}?next=/${locale === 'en' ? 'en/' : ''}people`);
  }

  const people = await getPeopleWithRelations();
  return <PeopleView people={people} locale={locale} />;
}
