import { getTranslations } from 'next-intl/server';
import { getAbout } from '@/lib/db/settings';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('about') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const about = await getAbout();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'درباره روستا' : 'About the Village'}
      </h1>

      {(about.bodyEn || about.bodyFa) ? (
        <div className="bg-bg border border-primary/20 rounded-2xl p-6 font-body text-text leading-relaxed whitespace-pre-wrap">
          {isFa ? about.bodyFa : about.bodyEn}
        </div>
      ) : (
        <p className="text-text-muted font-body">
          {isFa ? 'محتوایی ثبت نشده.' : 'Content not yet added.'}
        </p>
      )}
    </div>
  );
}
