'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/navigation';

interface Proverb {
  id: string;
  textEn: string;
  textFa: string;
  meaningEn: string;
  meaningFa: string;
}

interface Props {
  proverbs: Proverb[];
  locale: string;
  suggestHref?: string;
  showSuggest: boolean;
}

export function ProverbSearch({ proverbs, locale, suggestHref, showSuggest }: Props) {
  const isFa = locale === 'fa';
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return proverbs;
    const ql = q.toLowerCase();
    return proverbs.filter(
      (p) =>
        p.textEn.toLowerCase().includes(ql) ||
        p.textFa.includes(q) ||
        p.meaningEn.toLowerCase().includes(ql) ||
        p.meaningFa.includes(q),
    );
  }, [proverbs, query]);

  return (
    <div dir={isFa ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'ضرب‌المثل‌ها' : 'Proverbs'}
        </h1>
        {showSuggest && suggestHref && (
          <Link
            href={suggestHref as Parameters<typeof Link>[0]['href']}
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
          >
            {isFa ? '+ پیشنهاد' : '+ Suggest'}
          </Link>
        )}
      </div>

      <div className="relative mb-6">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          dir={isFa ? 'rtl' : 'ltr'}
          placeholder={isFa ? 'جستجو در ضرب‌المثل‌ها…' : 'Search proverbs…'}
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

      {query.trim() && (
        <p className="text-xs text-text-muted font-body mb-4">
          {results.length === 0
            ? (isFa ? 'نتیجه‌ای یافت نشد.' : 'No results found.')
            : isFa ? `${results.length} ضرب‌المثل یافت شد` : `${results.length} result${results.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {results.length === 0 && !query.trim() ? (
        <p className="text-text-muted font-body">{isFa ? 'ضرب‌المثلی ثبت نشده.' : 'No proverbs yet.'}</p>
      ) : (
        <div className="space-y-4">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/proverbs/${p.id}` as Parameters<typeof Link>[0]['href']}
              className="block bg-primary-light border border-primary/20 rounded-2xl p-5 hover:border-primary/60 transition-colors"
            >
              <p className="font-heading text-lg font-semibold text-primary mb-2">
                {isFa ? p.textFa : p.textEn}
              </p>
              <p className="text-sm text-text font-body">
                {isFa ? p.meaningFa : p.meaningEn}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
