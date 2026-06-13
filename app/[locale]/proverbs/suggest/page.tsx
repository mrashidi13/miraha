import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { actionSuggestProverb } from '@/app/actions/proverbs';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Suggest a Proverb' };

export default async function SuggestProverbPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const user = await getServerUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/proverbs/suggest`);

  const action = actionSuggestProverb.bind(null, locale);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link
        href="/proverbs"
        className="text-sm text-accent hover:underline font-body mb-6 inline-block"
      >
        ← {isFa ? 'بازگشت به ضرب‌المثل‌ها' : 'Back to Proverbs'}
      </Link>

      <h1 className="font-heading text-2xl font-bold text-primary mb-2">
        {isFa ? 'پیشنهاد ضرب‌المثل' : 'Suggest a Proverb'}
      </h1>
      <p className="text-sm text-text-muted font-body mb-8">
        {isFa
          ? 'ضرب‌المثلی از روستا می‌شناسید؟ آن را اینجا ثبت کنید تا بررسی شود.'
          : 'Know a proverb from the village? Submit it here — an admin will review and approve it.'}
      </p>

      <form action={action} className="space-y-5 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'ضرب‌المثل (فارسی) *' : 'Proverb (Persian) *'}
            </label>
            <textarea
              name="textFa"
              required
              rows={2}
              dir="rtl"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'ضرب‌المثل (انگلیسی)' : 'Proverb (English)'}
              <span className="text-text-muted ml-1">{isFa ? '(اختیاری)' : '(optional)'}</span>
            </label>
            <textarea
              name="textEn"
              rows={2}
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'معنی (فارسی) *' : 'Meaning (Persian) *'}
            </label>
            <textarea
              name="meaningFa"
              required
              rows={2}
              dir="rtl"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'معنی (انگلیسی)' : 'Meaning (English)'}
              <span className="text-text-muted ml-1">{isFa ? '(اختیاری)' : '(optional)'}</span>
            </label>
            <textarea
              name="meaningEn"
              rows={2}
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted font-body mb-1">
            {isFa ? 'چه زمانی استفاده می‌شود؟' : 'When is it used?'}
            <span className="text-text-muted ml-1">{isFa ? '(اختیاری)' : '(optional)'}</span>
          </label>
          <textarea
            name="usageFa"
            rows={2}
            dir="rtl"
            className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <SubmitButton label={isFa ? 'ارسال برای بررسی' : 'Submit for Review'} />
      </form>
    </div>
  );
}
