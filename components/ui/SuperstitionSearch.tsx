'use client';

import { useState, useMemo } from 'react';

interface Superstition {
  id: string;
  textEn: string;
  textFa: string;
  explanationEn: string;
  explanationFa: string;
  category: string;
}

interface Props {
  superstitions: Superstition[];
  locale: string;
}

export function SuperstitionSearch({ superstitions, locale }: Props) {
  const isFa = locale === 'fa';
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return superstitions;
    const ql = q.toLowerCase();
    return superstitions.filter(
      (s) =>
        s.textEn.toLowerCase().includes(ql) ||
        s.textFa.includes(q) ||
        s.explanationEn.toLowerCase().includes(ql) ||
        s.explanationFa.includes(q) ||
        s.category.toLowerCase().includes(ql),
    );
  }, [superstitions, query]);

  const categories = useMemo(() => {
    const cats = [...new Set(superstitions.map((s) => s.category).filter(Boolean))];
    return cats;
  }, [superstitions]);

  return (
    <div dir={isFa ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'خرافات' : 'Superstitions'}
        </h1>
        <span className="text-xs text-text-muted font-body">{superstitions.length}</span>
      </div>

      <p className="text-sm text-text-muted font-body mb-6">
        {isFa
          ? 'باورها و خرافات سینه‌به‌سینه روستا'
          : 'Traditional beliefs and folklore passed down through generations'}
      </p>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          dir={isFa ? 'rtl' : 'ltr'}
          placeholder={isFa ? 'جستجو در خرافات…' : 'Search superstitions…'}
          className="w-full ps-9 pe-9 py-2.5 rounded-xl border border-primary/30 bg-bg font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light transition-colors text-xs">✕</button>
        )}
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setQuery(query === cat ? '' : cat)}
              className={`px-3 py-1 rounded-full text-xs font-body border transition-colors ${
                query === cat
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/30 text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {query.trim() && (
        <p className="text-xs text-text-muted font-body mb-4">
          {results.length === 0
            ? (isFa ? 'نتیجه‌ای یافت نشد.' : 'No results found.')
            : isFa ? `${results.length} مورد یافت شد` : `${results.length} result${results.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {results.length === 0 && !query.trim() ? (
        <p className="text-text-muted font-body">{isFa ? 'موردی ثبت نشده.' : 'No superstitions recorded yet.'}</p>
      ) : (
        <div className="space-y-4">
          {results.map((s) => (
            <div key={s.id} className="bg-primary-light border border-primary/20 rounded-2xl p-5">
              {s.category && (
                <span className="inline-block text-[10px] font-body uppercase tracking-wider text-primary/60 border border-primary/20 rounded-full px-2 py-0.5 mb-3">
                  {s.category}
                </span>
              )}
              <p className="font-heading text-lg font-semibold text-primary mb-2">
                {isFa ? s.textFa : s.textEn}
              </p>
              {(isFa ? s.explanationFa : s.explanationEn) && (
                <p className="text-sm text-text font-body">
                  {isFa ? s.explanationFa : s.explanationEn}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
