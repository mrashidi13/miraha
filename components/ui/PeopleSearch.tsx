'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface Person {
  id: string;
  nameEn: string;
  nameFa: string;
  roleEn?: string | null;
  roleFa?: string | null;
  locationEn?: string | null;
  locationFa?: string | null;
  photoUrl?: string | null;
}

interface Props {
  people: Person[];
  locale: string;
  familyTreeHref: string;
}

export function PeopleSearch({ people, locale, familyTreeHref }: Props) {
  const isFa = locale === 'fa';
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return people;
    const ql = q.toLowerCase();
    return people.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(ql) ||
        p.nameFa.includes(q) ||
        (p.roleEn?.toLowerCase().includes(ql) ?? false) ||
        (p.roleFa?.includes(q) ?? false) ||
        (p.locationEn?.toLowerCase().includes(ql) ?? false) ||
        (p.locationFa?.includes(q) ?? false),
    );
  }, [people, query]);

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'مردم' : 'People Directory'}
        </h1>
        <Link
          href={familyTreeHref as Parameters<typeof Link>[0]['href']}
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-light border border-primary/30 text-sm font-body text-primary hover:border-primary/60 hover:shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isFa ? 'درخت خانوادگی' : 'Family Tree'}
        </Link>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          dir="auto"
          placeholder={isFa ? 'جستجوی نام، نقش، مکان…' : 'Search name, role, location…'}
          className="w-full ps-9 pe-9 py-2.5 rounded-xl border border-primary/30 bg-bg font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light transition-colors text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {query.trim() && (
        <p className="text-xs text-text-muted font-body mb-4">
          {results.length === 0
            ? (isFa ? 'نتیجه‌ای یافت نشد.' : 'No results found.')
            : isFa
              ? `${results.length} نفر یافت شد`
              : `${results.length} result${results.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Grid */}
      {results.length === 0 && !query.trim() ? (
        <p className="text-text-muted font-body">{isFa ? 'نام کسی ثبت نشده.' : 'No people listed yet.'}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((p) => {
            const name = isFa ? p.nameFa : p.nameEn;
            return (
              <div key={p.id} className="flex gap-4 bg-bg border border-primary/20 rounded-2xl p-4">
                <div className="flex-shrink-0">
                  {p.photoUrl ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image src={p.photoUrl} alt={name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                      <span className="font-heading text-xl font-bold text-primary">{name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary">{name}</p>
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
            );
          })}
        </div>
      )}
    </>
  );
}
