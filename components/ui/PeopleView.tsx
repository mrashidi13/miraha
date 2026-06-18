'use client';

import { useState } from 'react';
import { FamilyTree } from './FamilyTree';
import { PeopleSearch } from './PeopleSearch';
import type { PersonData } from './FamilyTree';

interface Props {
  people: PersonData[];
  locale: string;
}

export function PeopleView({ people, locale }: Props) {
  const isFa = locale === 'fa';
  const [view, setView] = useState<'tree' | 'list'>('tree');

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header bar */}
      <div className="flex-shrink-0 border-b border-primary/10 bg-bg px-4 py-2 flex items-center justify-between gap-4">
        <h1 className="font-heading font-semibold text-primary text-sm">
          {isFa ? 'مردم روستا' : 'Village People'}
        </h1>

        {/* Toggle */}
        <div className="flex items-center gap-1 bg-primary-light rounded-xl p-1 border border-primary/20">
          <button
            onClick={() => setView('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
              view === 'tree'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text hover:text-primary'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm-10 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            {isFa ? 'درخت' : 'Tree'}
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
              view === 'list'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text hover:text-primary'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {isFa ? 'فهرست' : 'List'}
          </button>
        </div>

        <p className="text-xs text-text-muted font-body hidden sm:block">
          {isFa
            ? `${people.length} نفر`
            : `${people.length} people`}
        </p>
      </div>

      {/* Content */}
      {view === 'tree' ? (
        <div className="flex-1 min-h-0">
          <FamilyTree people={people} locale={locale} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 w-full">
            <PeopleSearch
              people={people}
              locale={locale}
              familyTreeHref="/people"
              showHeader={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
