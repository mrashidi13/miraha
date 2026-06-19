'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { UserMenu } from '@/components/ui/UserMenu';
import { LoginDropdown } from '@/components/ui/LoginDropdown';

const PUBLIC_NAV_KEYS = [
  'dictionary', 'proverbs', 'superstitions', 'places', 'news', 'gallery',
  'events', 'map', 'about',
] as const;

const AUTH_NAV_KEYS = ['people'] as const;

interface Props {
  userEmail?: string | null;
  isAdmin?: boolean;
}

const NAV_ICONS: Record<string, string> = {
  dictionary: '📖',
  proverbs: '💬',
  superstitions: '🌙',
  places: '📍',
  news: '📰',
  gallery: '🖼️',
  events: '📅',
  map: '🗺️',
  about: 'ℹ️',
  people: '🌳',
};

export function SiteHeader({ userEmail, isAdmin }: Props) {
  const t = useTranslations('nav');
  const ts = useTranslations('site');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isFa = locale === 'fa';
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function switchLocale() {
    const next = locale === 'en' ? 'fa' : 'en';
    router.replace(pathname, { locale: next });
  }

  const allNavKeys = [...PUBLIC_NAV_KEYS, ...(userEmail ? AUTH_NAV_KEYS : [])] as const;

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg border-b border-primary/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="font-heading font-bold text-xl text-primary flex-shrink-0">
            {ts('name')}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            {PUBLIC_NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="px-3 py-1.5 rounded-lg text-sm font-body text-text hover:bg-primary-light hover:text-primary transition-colors whitespace-nowrap"
              >
                {t(key)}
              </Link>
            ))}
            {userEmail && AUTH_NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="px-3 py-1.5 rounded-lg text-sm font-body text-text hover:bg-primary-light hover:text-primary transition-colors whitespace-nowrap"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={switchLocale}
              className="px-3 py-1 rounded-lg border border-primary/40 text-sm font-body text-primary hover:bg-primary-light transition-colors"
            >
              {isFa ? 'English' : 'فارسی'}
            </button>

            {userEmail ? (
              <UserMenu email={userEmail} isAdmin={!!isAdmin} locale={locale} />
            ) : (
              <div className="hidden sm:block">
                <LoginDropdown locale={locale} />
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-primary-light transition-colors gap-1.5"
            >
              <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer panel */}
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className={`fixed top-14 inset-x-0 z-30 md:hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="mx-3 mt-2 mb-4 rounded-2xl bg-bg border border-primary/20 shadow-xl overflow-hidden">

          {/* Nav links grid */}
          <div className="p-3 grid grid-cols-3 gap-1.5">
            {allNavKeys.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl hover:bg-primary-light transition-colors group"
              >
                <span className="text-xl">{NAV_ICONS[key]}</span>
                <span className="text-[11px] font-body text-text group-hover:text-primary transition-colors text-center leading-tight">
                  {t(key as Parameters<typeof t>[0])}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-primary/10 mx-3" />

          {/* Bottom row: locale + login/profile */}
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <button
              onClick={switchLocale}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-sm font-body text-primary hover:bg-primary-light transition-colors"
            >
              🌐 {isFa ? 'English' : 'فارسی'}
            </button>

            {userEmail ? (
              <UserMenu email={userEmail} isAdmin={!!isAdmin} locale={locale} />
            ) : (
              <LoginDropdown locale={locale} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
