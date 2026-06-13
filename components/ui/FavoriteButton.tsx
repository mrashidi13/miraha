'use client';

import { useState, useTransition } from 'react';
import { actionToggleFavorite } from '@/app/actions/favorites';

interface Props {
  wordId: string;
  initialFavorited: boolean;
  locale: string;
}

export function FavoriteButton({ wordId, initialFavorited, locale }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    setFavorited((f) => !f);
    startTransition(() => actionToggleFavorite(wordId));
  };

  const isFa = locale === 'fa';

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={
        favorited
          ? (isFa ? 'حذف از علاقه‌مندی‌ها' : 'Remove from favorites')
          : (isFa ? 'افزودن به علاقه‌مندی‌ها' : 'Add to favorites')
      }
      className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors disabled:opacity-60 ${
        favorited
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-primary/30 text-text-muted hover:border-accent hover:text-accent'
      }`}
    >
      <span className="text-lg leading-none select-none">{favorited ? '♥' : '♡'}</span>
    </button>
  );
}
