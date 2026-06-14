import { getSubscribers, countSubscribers } from '@/lib/db/newsletter';
import { actionDeleteSubscriber } from '@/app/actions/newsletter';
import { NewsletterSendForm } from '@/components/admin/NewsletterSendForm';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Newsletter' };

export default async function AdminNewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const [subscribers, count] = await Promise.all([getSubscribers(false), countSubscribers()]);
  const hasApiKey = !!process.env.RESEND_API_KEY;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {isFa ? 'خبرنامه' : 'Newsletter'}
          </h1>
          <p className="text-sm text-text-muted font-body mt-1">
            {isFa
              ? `${count} مشترک فعال`
              : `${count} active subscriber${count === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {/* Send form */}
      <NewsletterSendForm isFa={isFa} subscriberCount={count} hasApiKey={hasApiKey} />

      {/* Subscriber list */}
      <div>
        <h2 className="font-heading text-base font-semibold text-primary mb-4">
          {isFa ? 'فهرست مشترکان' : 'Subscribers'}
        </h2>

        {subscribers.length === 0 ? (
          <div className="rounded-2xl border border-primary/20 bg-bg p-8 text-center text-text-muted font-body text-sm">
            {isFa ? 'هنوز مشترکی ثبت نشده.' : 'No subscribers yet.'}
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 overflow-hidden">
            <table className="w-full text-sm font-body">
              <thead className="bg-primary-light border-b border-primary/10">
                <tr>
                  <th className="px-4 py-3 text-start text-xs text-text-muted uppercase tracking-wider font-medium">
                    {isFa ? 'ایمیل' : 'Email'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs text-text-muted uppercase tracking-wider font-medium">
                    {isFa ? 'نام' : 'Name'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs text-text-muted uppercase tracking-wider font-medium">
                    {isFa ? 'زبان' : 'Lang'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs text-text-muted uppercase tracking-wider font-medium">
                    {isFa ? 'وضعیت' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs text-text-muted uppercase tracking-wider font-medium">
                    {isFa ? 'تاریخ' : 'Joined'}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 bg-bg">
                {subscribers.map((s) => (
                  <tr key={s.id} className={s.active ? '' : 'opacity-50'}>
                    <td className="px-4 py-3 text-text">{s.email}</td>
                    <td className="px-4 py-3 text-text-muted">{s.name ?? '—'}</td>
                    <td className="px-4 py-3 text-text-muted uppercase">{s.locale}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? 'bg-accent/10 text-accent' : 'bg-primary-light text-text-muted'}`}>
                        {s.active ? (isFa ? 'فعال' : 'active') : (isFa ? 'لغو شده' : 'unsubscribed')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {new Date(s.subscribedAt).toLocaleDateString(isFa ? 'fa-IR' : 'en-GB', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <form action={actionDeleteSubscriber.bind(null, s.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:text-red-600 font-body transition-colors"
                        >
                          {isFa ? 'حذف' : 'Delete'}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!hasApiKey && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-body text-yellow-700">
          <p className="font-semibold mb-1">{isFa ? 'راه‌اندازی ارسال ایمیل' : 'Email sending setup'}</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>{isFa ? 'در resend.com ثبت‌نام کنید.' : 'Sign up at resend.com (free tier: 3,000 emails/month).'}</li>
            <li>{isFa ? 'یک کلید API بسازید.' : 'Create an API key.'}</li>
            <li>
              {isFa
                ? 'RESEND_API_KEY را در متغیرهای محیطی Vercel اضافه کنید.'
                : 'Add RESEND_API_KEY to your Vercel environment variables.'}
            </li>
            <li>
              {isFa
                ? 'اختیاری: NEWSLETTER_FROM_EMAIL را هم تنظیم کنید (پیش‌فرض: newsletter@miraha.vercel.app).'
                : 'Optional: set NEWSLETTER_FROM_EMAIL (default: newsletter@miraha.vercel.app).'}
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
