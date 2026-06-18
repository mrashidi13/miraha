'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface HeroSlideData {
  imageUrl: string;
  eyebrowEn: string;
  eyebrowFa: string;
  titleEn: string;
  titleFa: string;
  subtitleEn: string;
  subtitleFa: string;
}

interface HeroSlideshowProps {
  slides: HeroSlideData[];
  rotationInterval: number;
  locale: string;
  // Legacy fallback props (used when no slides are configured)
  legacyImages?: string[];
  legacyEyebrow?: string;
  legacyTitle?: string;
  legacySubtitle?: string;
}

export function HeroSlideshow({
  slides,
  rotationInterval,
  locale,
  legacyImages = [],
  legacyEyebrow = '',
  legacyTitle = '',
  legacySubtitle = '',
}: HeroSlideshowProps) {
  const isFa = locale === 'fa';
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use new slides if available, otherwise fall back to legacy
  const useSlides = slides.length > 0;
  const count = useSlides ? slides.length : legacyImages.length;
  const hasImages = count > 0;

  function startTimer() {
    if (!hasImages || count < 2) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, rotationInterval);
  }

  useEffect(() => {
    startTimer();
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, rotationInterval]);

  function go(idx: number) {
    if (timer.current) clearInterval(timer.current);
    setCurrent(idx);
    startTimer();
  }

  const currentEyebrow = useSlides
    ? (isFa ? slides[current]?.eyebrowFa : slides[current]?.eyebrowEn) || ''
    : legacyEyebrow;
  const currentTitle = useSlides
    ? (isFa ? slides[current]?.titleFa : slides[current]?.titleEn) || ''
    : legacyTitle;
  const currentSubtitle = useSlides
    ? (isFa ? slides[current]?.subtitleFa : slides[current]?.subtitleEn) || ''
    : legacySubtitle;

  return (
    <section className="relative flex flex-col items-center justify-center text-center overflow-hidden min-h-[420px] md:min-h-[520px]">
      {/* Background image slides */}
      {hasImages ? (
        <>
          {useSlides
            ? slides.map((s, i) => (
                <div
                  key={s.imageUrl + i}
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <Image
                    src={s.imageUrl}
                    alt=""
                    fill
                    className="object-cover scale-105 animate-[drift_15s_ease-in-out_infinite_alternate]"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>
              ))
            : legacyImages.map((src, i) => (
                <div
                  key={src}
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover scale-105 animate-[drift_15s_ease-in-out_infinite_alternate]"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>
              ))}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-bg to-primary/10" />
      )}

      {/* Text — transitions smoothly when slide changes */}
      <div className="relative z-10 px-6 py-16 flex flex-col items-center gap-3">
        {currentEyebrow && (
          <p className={`text-sm font-body tracking-widest uppercase ${hasImages ? 'text-white/80' : 'text-primary'}`}>
            {currentEyebrow}
          </p>
        )}
        {currentTitle && (
          <h1 className={`text-5xl md:text-6xl font-heading font-bold leading-tight ${hasImages ? 'text-white' : 'text-primary'}`}>
            {currentTitle}
          </h1>
        )}
        {currentSubtitle && (
          <p className={`text-lg md:text-xl font-body max-w-xl ${hasImages ? 'text-white/90' : 'text-text-muted'}`}>
            {currentSubtitle}
          </p>
        )}
      </div>

      {/* Prev / next + dots */}
      {hasImages && count > 1 && (
        <>
          <button
            onClick={() => go((current - 1 + count) % count)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => go((current + 1) % count)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
            aria-label="Next"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
