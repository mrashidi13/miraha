import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { actionSuggestWord } from '@/app/actions/words';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Suggest a Word' };

export default async function SuggestWordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const user = await getServerUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/dictionary/suggest`);

  const action = actionSuggestWord.bind(null, locale);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link
        href="/dictionary"
        className="text-sm text-accent hover:underline font-body mb-6 inline-block"
      >
        ← {isFa ? 'بازگشت به واژه‌نامه' : 'Back to Dictionary'}
      </Link>

      <h1 className="font-heading text-2xl font-bold text-primary mb-2">
        {isFa ? 'پیشنهاد واژه' : 'Suggest a Word'}
      </h1>
      <p className="text-sm text-text-muted font-body mb-8">
        {isFa
          ? 'واژه‌ای از زبان محلی روستا می‌شناسید؟ آن را اینجا ثبت کنید تا بررسی شود.'
          : 'Know a word from the village language? Submit it here — an admin will review and approve it.'}
      </p>

      <form action={action} className="space-y-5 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'واژه (زبان محلی) *' : 'Village word *'}
            </label>
            <input
              name="term"
              required
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'تلفظ' : 'Pronunciation'}
            </label>
            <input
              name="pronunciation"
              placeholder={isFa ? 'مثال: /kə-taa/' : 'e.g. /kə-taa/'}
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted font-body mb-1">
            {isFa ? 'معنی به فارسی *' : 'Persian meaning *'}
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
            {isFa ? 'معنی به انگلیسی' : 'English meaning'}
            <span className="text-text-muted ml-1">
              {isFa ? '(اختیاری)' : '(optional — admin will fill if blank)'}
            </span>
          </label>
          <textarea
            name="meaningEn"
            rows={2}
            className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'مثال (فارسی)' : 'Example (Persian)'}
            </label>
            <textarea
              name="exampleFa"
              rows={2}
              dir="rtl"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">
              {isFa ? 'مثال (انگلیسی)' : 'Example (English)'}
            </label>
            <textarea
              name="exampleEn"
              rows={2}
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <SubmitButton label={isFa ? 'ارسال برای بررسی' : 'Submit for Review'} />
      </form>
    </div>
  );
}
