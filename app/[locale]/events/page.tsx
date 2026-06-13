import { getTranslations } from 'next-intl/server';
import { getEvents } from '@/lib/db/events';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('events') };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const events = await getEvents();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'رویدادها' : 'Events & Calendar'}
      </h1>

      {events.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'رویدادی ثبت نشده.' : 'No events yet.'}</p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => {
            const date = new Date(e.startsAt);
            return (
              <div key={e.id} className="flex gap-4 bg-bg border border-primary/20 rounded-2xl p-5">
                <div className="flex-shrink-0 w-14 text-center">
                  <p className="font-heading text-2xl font-bold text-primary leading-none">
                    {date.getDate()}
                  </p>
                  <p className="text-xs text-text-muted font-body">
                    {date.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', { month: 'short' })}
                  </p>
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold text-primary">
                    {isFa ? e.titleFa : e.titleEn}
                  </h2>
                  {(e.descriptionEn || e.descriptionFa) && (
                    <p className="text-sm text-text font-body mt-1">
                      {isFa ? e.descriptionFa : e.descriptionEn}
                    </p>
                  )}
                  {e.location && (
                    <p className="text-xs text-text-muted font-body mt-2">📍 {e.location}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
