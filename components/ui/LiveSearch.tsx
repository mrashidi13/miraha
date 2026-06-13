'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';

type Word = {
  id: string;
  term: string;
  pronunciation: string | null;
  meaningEn: string;
  meaningFa: string;
};

type Proverb = {
  id: string;
  textEn: string;
  textFa: string;
  meaningEn: string;
  meaningFa: string;
};

interface Props {
  words: Word[];
  proverbs: Proverb[];
  locale: string;
}

export function LiveSearch({ words, proverbs, locale }: Props) {
  const [query, setQuery] = useState('');
  const isFa = locale === 'fa';
  const q = query.trim().toLowerCase();

  const filteredWords = q
    ? words.filter(
        (w) =>
          w.term.toLowerCase().includes(q) ||
          w.meaningEn.toLowerCase().includes(q) ||
          w.meaningFa.includes(q),
      )
    : words.slice(0, 6);

  const filteredProverbs = q
    ? proverbs.filter(
        (p) =>
          p.textEn.toLowerCase().includes(q) ||
          p.textFa.includes(q) ||
          p.meaningEn.toLowerCase().includes(q) ||
          p.meaningFa.includes(q),
      )
    : proverbs.slice(0, 3);

  const noResults = q && filteredWords.length === 0 && filteredProverbs.length === 0;

  return (
    <section className="bg-primary-light py-14 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header + search input */}
        <div className="mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
            {isFa ? 'جستجو در میراها' : 'Search Miraha'}
          </h2>
          <p className="text-sm text-text-muted font-body mb-5">
            {isFa
              ? 'واژه یا ضرب‌المثل بنویسید — نتایج فوری نمایش داده می‌شود'
              : 'Type a word or phrase — results appear instantly'}
          </p>
          <div className="relative">
            <span className="absolute inset-y-0 start-4 flex items-center pointer-events-none text-text-muted">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              dir="auto"
              placeholder={isFa ? 'مثلاً: لرگ، باران، قنات…' : 'e.g. breeze, water, desert…'}
              className="w-full rounded-xl border border-primary/30 bg-bg ps-12 pe-4 py-3.5 text-base font-body text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 end-4 flex items-center text-text-muted hover:text-text transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {noResults ? (
          <p className="text-center text-text-muted font-body py-8">
            {isFa ? 'نتیجه‌ای یافت نشد.' : 'No results found.'}
          </p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Dictionary column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-primary">
                  {isFa ? 'واژه‌نامه' : 'Dictionary'}
                  {q && (
                    <span className="ms-2 text-sm font-body text-text-muted font-normal">
                      ({filteredWords.length})
                    </span>
                  )}
                </h3>
                <Link href="/dictionary" className="text-xs text-accent font-body hover:underline">
                  {isFa ? 'همه ←' : 'All →'}
                </Link>
              </div>

              {filteredWords.length === 0 ? (
                <p className="text-sm text-text-muted font-body">
                  {isFa ? 'واژه‌ای یافت نشد.' : 'No words match.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredWords.slice(0, 6).map((w) => (
                    <Link
                      key={w.id}
                      href={`/dictionary/${w.id}`}
                      className="flex items-start gap-3 bg-bg rounded-xl border border-primary/20 px-4 py-3 hover:border-primary/50 hover:shadow-sm transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                            {w.term}
                          </span>
                          {w.pronunciation && (
                            <span className="text-xs text-text-muted font-body flex-shrink-0">
                              /{w.pronunciation}/
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text font-body mt-0.5 line-clamp-1">
                          {isFa ? w.meaningFa : w.meaningEn}
                        </p>
                      </div>
                      <span className="text-text-muted group-hover:text-accent transition-colors text-sm flex-shrink-0 mt-1">
                        {isFa ? '←' : '→'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {!q && words.length > 6 && (
                <Link
                  href="/dictionary"
                  className="block mt-3 text-sm text-accent font-body hover:underline text-end"
                >
                  {isFa ? `+ ${words.length - 6} واژه دیگر` : `+ ${words.length - 6} more words`}
                </Link>
              )}
            </div>

            {/* Proverbs column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-primary">
                  {isFa ? 'ضرب‌المثل‌ها' : 'Proverbs'}
                  {q && (
                    <span className="ms-2 text-sm font-body text-text-muted font-normal">
                      ({filteredProverbs.length})
                    </span>
                  )}
                </h3>
                <Link href="/proverbs" className="text-xs text-accent font-body hover:underline">
                  {isFa ? 'همه ←' : 'All →'}
                </Link>
              </div>

              {filteredProverbs.length === 0 ? (
                <p className="text-sm text-text-muted font-body">
                  {isFa ? 'ضرب‌المثلی یافت نشد.' : 'No proverbs match.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredProverbs.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/proverbs/${p.id}`}
                      className="block bg-bg rounded-xl border border-primary/20 px-4 py-3 hover:border-primary/50 hover:shadow-sm transition-all group"
                    >
                      <p className="font-heading text-sm font-semibold text-primary leading-snug mb-1 group-hover:text-primary/80 transition-colors">
                        {isFa ? p.textFa : p.textEn}
                      </p>
                      <p className="text-xs text-text-muted font-body line-clamp-1">
                        {isFa ? p.meaningFa : p.meaningEn}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {!q && proverbs.length > 3 && (
                <Link
                  href="/proverbs"
                  className="block mt-3 text-sm text-accent font-body hover:underline text-end"
                >
                  {isFa ? `+ ${proverbs.length - 3} ضرب‌المثل دیگر` : `+ ${proverbs.length - 3} more`}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
