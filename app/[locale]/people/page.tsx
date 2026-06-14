import { getTranslations } from 'next-intl/server';
import { getPeople } from '@/lib/db/people';
import { Link } from '@/i18n/navigation';
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
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'مردم' : 'People Directory'}
        </h1>
        <Link
          href="/family-tree"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-light border border-primary/30 text-sm font-body text-primary hover:border-primary/60 hover:shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isFa ? 'درخت خانوادگی' : 'Family Tree'}
        </Link>
      </div>

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
