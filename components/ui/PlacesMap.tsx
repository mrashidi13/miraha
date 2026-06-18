'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MapWithNoSSR = dynamic(() => import('./PlacesMapInner'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-primary-light text-text-muted font-body text-sm">Loading map…</div>
) });

interface Place {
  id: string;
  nameEn: string;
  nameFa: string;
  descriptionEn: string;
  descriptionFa: string;
  lat: number | null;
  lng: number | null;
  imageUrls: string[];
}

interface Props {
  places: Place[];
  locale: string;
}

export function PlacesMap({ places, locale }: Props) {
  const isFa = locale === 'fa';
  const [selected, setSelected] = useState<Place | null>(null);
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const placesWithCoords = places.filter((p) => p.lat && p.lng);

  return (
    <div dir={isFa ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-3xl font-bold text-primary">
          {isFa ? 'مکان‌های دیدنی' : 'Scenic Places'}
        </h1>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-primary-light rounded-xl p-1 border border-primary/20">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${view === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-text hover:text-primary'}`}
          >
            {isFa ? 'شبکه' : 'Grid'}
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${view === 'map' ? 'bg-primary text-white shadow-sm' : 'text-text hover:text-primary'}`}
          >
            {isFa ? 'نقشه' : 'Map'}
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {places.length === 0 ? (
            <p className="text-text-muted font-body col-span-2">{isFa ? 'مکانی ثبت نشده.' : 'No places listed yet.'}</p>
          ) : (
            places.map((place) => (
              <div
                key={place.id}
                onClick={() => { setSelected(place); setView('map'); }}
                className="group bg-bg border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              >
                {place.imageUrls[0] && (
                  <div className="relative aspect-[16/9] bg-primary-light overflow-hidden">
                    <Image
                      src={place.imageUrls[0]}
                      alt={isFa ? place.nameFa : place.nameEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-heading text-lg font-semibold text-primary mb-1">
                    {isFa ? place.nameFa : place.nameEn}
                  </h2>
                  {(isFa ? place.descriptionFa : place.descriptionEn) && (
                    <p className="text-sm text-text font-body line-clamp-2">
                      {isFa ? place.descriptionFa : place.descriptionEn}
                    </p>
                  )}
                  {place.lat && place.lng && (
                    <p className="text-xs text-text-muted font-body mt-2 flex items-center gap-1">
                      📍 {isFa ? 'روی نقشه ببینید' : 'View on map'}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-primary/20" style={{ height: '500px' }}>
            {placesWithCoords.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-primary-light text-text-muted font-body text-sm">
                {isFa ? 'هیچ مکانی با مختصات ثبت نشده.' : 'No places with coordinates yet.'}
              </div>
            ) : (
              <MapWithNoSSR places={placesWithCoords} selected={selected} onSelect={setSelected} locale={locale} />
            )}
          </div>

          {selected && (
            <div className="bg-bg border border-primary/20 rounded-2xl p-5">
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                {isFa ? selected.nameFa : selected.nameEn}
              </h2>
              {(isFa ? selected.descriptionFa : selected.descriptionEn) && (
                <p className="text-sm text-text font-body mb-4">
                  {isFa ? selected.descriptionFa : selected.descriptionEn}
                </p>
              )}
              {selected.imageUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selected.imageUrls.map((url, i) => (
                    <div key={i} className="relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden">
                      <Image src={url} alt={`${selected.nameEn} ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {selected.lat && selected.lng && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs text-accent font-body hover:underline"
                >
                  {isFa ? 'باز کردن در OpenStreetMap ↗' : 'Open in OpenStreetMap ↗'}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
