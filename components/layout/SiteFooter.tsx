import { useTranslations } from 'next-intl';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

export function SiteFooter({ locale }: { locale: string }) {
  const t = useTranslations('site');
  const isFa = locale === 'fa';

  return (
    <footer className="mt-auto border-t border-primary/20 bg-primary-light pt-10 pb-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Newsletter */}
        <div className="text-center mb-8">
          <p className="font-heading font-semibold text-primary text-base mb-1">
            {isFa ? 'عضویت در خبرنامه' : 'Stay in touch'}
          </p>
          <p className="text-xs text-text-muted font-body mb-4">
            {isFa
              ? 'اخبار روستا را مستقیم به ایمیل شما می‌فرستیم.'
              : 'Get village news and updates delivered to your inbox.'}
          </p>
          <NewsletterSignup locale={locale} />
        </div>

        <div className="border-t border-primary/10 pt-5 text-center text-sm text-text-muted font-body">
          <p className="font-heading font-semibold text-primary mb-1">{t('name')} · {t('tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
