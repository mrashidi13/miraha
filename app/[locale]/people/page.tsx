import { getTranslations } from 'next-intl/server';
import { getPeople } from '@/lib/db/people';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('people') };
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const people = await getPeople();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-8">
        {isFa ? 'مردم' : 'People Directory'}
      </h1>

      {people.length === 0 ? (
        <p className="text-text-muted font-body">{isFa ? 'نام کسی ثبت نشده.' : 'No people listed yet.'}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {people.map((p) => (
            <div key={p.id} className="flex gap-4 bg-bg border border-primary/20 rounded-2xl p-4">
              <div className="flex-shrink-0">
                {p.photoUrl ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image src={p.photoUrl} alt={isFa ? p.nameFa : p.nameEn} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="font-heading text-xl font-bold text-primary">
                      {(isFa ? p.nameFa : p.nameEn).charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-heading font-semibold text-primary">
                  {isFa ? p.nameFa : p.nameEn}
                </p>
                {(p.roleEn || p.roleFa) && (
                  <p className="text-sm text-text font-body">{isFa ? p.roleFa : p.roleEn}</p>
                )}
                {(p.locationEn || p.locationFa) && (
                  <p className="text-xs text-text-muted font-body mt-1">
                    📍 {isFa ? p.locationFa : p.locationEn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
