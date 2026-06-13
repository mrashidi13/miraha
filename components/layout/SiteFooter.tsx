import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('site');
  return (
    <footer className="mt-auto border-t border-primary/20 bg-primary-light py-6 px-4 text-center text-sm text-text-muted font-body">
      <p className="font-heading font-semibold text-primary mb-1">{t('name')} · {t('tagline')}</p>
    </footer>
  );
}
