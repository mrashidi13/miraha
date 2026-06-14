import { deactivateSubscriber } from '@/lib/db/newsletter';
import { Link } from '@/i18n/navigation';

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const isFa = locale === 'fa';
  const email = sp.email ?? '';

  let ok = false;
  if (email) {
    try {
      await deactivateSubscriber(email);
      ok = true;
    } catch {
      // email not found — treat as already unsubscribed
      ok = true;
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {ok ? (
        <>
          <p className="font-heading text-2xl font-bold text-primary mb-3">
            {isFa ? 'لغو اشتراک انجام شد' : 'You\'ve been unsubscribed'}
          </p>
          <p className="font-body text-sm text-text-muted mb-6">
            {isFa
              ? `${email} دیگر خبرنامه دریافت نمی‌کند.`
              : `${email} will no longer receive newsletters.`}
          </p>
        </>
      ) : (
        <p className="font-body text-sm text-text-muted mb-6">
          {isFa ? 'آدرس ایمیل معتبر نیست.' : 'No email address provided.'}
        </p>
      )}
      <Link href="/" className="text-sm text-accent hover:underline font-body">
        {isFa ? 'بازگشت به خانه' : 'Back to home'}
      </Link>
    </div>
  );
}
