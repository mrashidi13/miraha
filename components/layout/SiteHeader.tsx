'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';

const NAV_KEYS = [
  'dictionary',
  'proverbs',
  'news',
  'gallery',
  'events',
  'people',
  'map',
  'about',
] as const;

export function SiteHeader() {
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
        <Link href="/" className="font-heading font-bold text-xl text-primary">
          {ts('name')}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={`/${key}`}
              className="px-3 py-1.5 rounded-lg text-sm font-body text-text hover:bg-primary-light hover:text-primary transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={switchLocale}
            className="px-3 py-1 rounded-lg border border-primary/40 text-sm font-body text-primary hover:bg-primary-light transition-colors"
          >
            {locale === 'en' ? 'فارسی' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
}
