'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

const PUBLIC_NAV_KEYS = [
  'dictionary', 'proverbs', 'superstitions', 'places', 'news', 'gallery',
  'events', 'map', 'about',
] as const;

const AUTH_NAV_KEYS = ['people'] as const;

interface Props {
  userEmail?: string | null;
  isAdmin?: boolean;
}

export function SiteHeader({ userEmail, isAdmin }: Props) {
  const t = useTranslations('nav');
  const ts = useTranslations('site');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const next = locale === 'en' ? 'fa' : 'en';
    router.replace(pathname, { locale: next });
  }

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-primary/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-heading font-bold text-xl text-primary flex-shrink-0">
          {ts('name')}
        </Link>

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

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={switchLocale}
            className="px-3 py-1 rounded-lg border border-primary/40 text-sm font-body text-primary hover:bg-primary-light transition-colors"
          >
            {locale === 'en' ? 'فارسی' : 'English'}
          </button>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-heading font-bold hover:bg-primary/80 transition-colors"
                title={userEmail}
              >
                {userEmail.charAt(0).toUpperCase()}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-block px-3 py-1 rounded-lg bg-accent text-white text-xs font-body hover:bg-accent-hover transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
            >
              {locale === 'fa' ? 'ورود' : 'Login'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
