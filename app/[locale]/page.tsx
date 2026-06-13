import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  return (
    <main className="flex flex-col flex-1">
      {/* Hero placeholder — replaced by slideshow in Phase 1 */}
      <section className="flex flex-col items-center justify-center text-center bg-primary-light py-24 px-6 gap-4">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary leading-tight">
          {t('welcome')}
        </h1>
        <p className="text-lg text-text-muted max-w-xl">{t('subtitle')}</p>
      </section>

      {/* Quick-nav cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto w-full px-6 py-12">
        {(
          [
            'dictionary',
            'proverbs',
            'news',
            'gallery',
            'events',
            'people',
            'map',
            'about',
          ] as const
        ).map((key) => (
          <Link
            key={key}
            href={`/${key}`}
            className="flex items-center justify-center rounded-xl border border-primary/30 bg-bg py-6 px-4 text-center text-sm font-body font-medium text-primary hover:bg-primary-light transition-colors"
          >
            {tNav(key)}
          </Link>
        ))}
      </section>
    </main>
  );
}
