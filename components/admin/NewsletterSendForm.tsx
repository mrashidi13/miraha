'use client';

import { useActionState } from 'react';
import { actionSendNewsletter } from '@/app/actions/newsletter';
import { SubmitButton } from '@/components/admin/SubmitButton';

interface Props {
  isFa: boolean;
  subscriberCount: number;
  hasApiKey: boolean;
}

export function NewsletterSendForm({ isFa, subscriberCount, hasApiKey }: Props) {
  const [result, dispatch] = useActionState(
    async (_prev: unknown, formData: FormData) => actionSendNewsletter(formData),
    null,
  );

  return (
    <div className="bg-bg border border-primary/20 rounded-2xl p-5">
      <h2 className="font-heading text-base font-semibold text-primary mb-4">
        {isFa ? 'ارسال خبرنامه' : 'Send Newsletter'}
      </h2>

      {!hasApiKey && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm font-body text-yellow-700">
          {isFa
            ? 'کلید RESEND_API_KEY تنظیم نشده. برای ارسال ایمیل، آن را در متغیرهای محیطی Vercel اضافه کنید.'
            : 'RESEND_API_KEY is not set. Add it to your Vercel environment variables to enable sending.'}
        </div>
      )}

      {result?.ok && (
        <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/30 text-sm font-body text-accent">
          {isFa
            ? `خبرنامه با موفقیت برای ${result.count} مشترک ارسال شد.`
            : `Newsletter sent successfully to ${result.count} subscriber${result.count === 1 ? '' : 's'}.`}
        </div>
      )}

      {result?.error && result.error !== 'no_api_key' && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-body text-red-600">
          {result.error === 'missing_fields'
            ? (isFa ? 'موضوع و متن انگلیسی الزامی است.' : 'English subject and body are required.')
            : result.error === 'no_subscribers'
              ? (isFa ? 'هیچ مشترک فعالی وجود ندارد.' : 'No active subscribers.')
              : (isFa ? 'خطا در ارسال.' : 'Send failed.')}
        </div>
      )}

      <form action={dispatch} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body text-text-muted mb-1 uppercase tracking-wider">
              {isFa ? 'موضوع (انگلیسی)' : 'Subject (English)'}
            </label>
            <input
              name="subjectEn"
              required
              className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-body text-text-muted mb-1 uppercase tracking-wider">
              {isFa ? 'موضوع (فارسی)' : 'Subject (Persian)'}
            </label>
            <input
              name="subjectFa"
              dir="rtl"
              className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body text-text-muted mb-1 uppercase tracking-wider">
              {isFa ? 'متن (انگلیسی)' : 'Body (English)'}
            </label>
            <textarea
              name="bodyEn"
              required
              rows={6}
              className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body text-text-muted mb-1 uppercase tracking-wider">
              {isFa ? 'متن (فارسی)' : 'Body (Persian)'}
            </label>
            <textarea
              name="bodyFa"
              dir="rtl"
              rows={6}
              className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton
            label={isFa ? `ارسال به ${subscriberCount} مشترک` : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'}`}
            disabled={!hasApiKey || subscriberCount === 0}
          />
          <p className="text-xs text-text-muted font-body">
            {isFa
              ? 'ایمیل‌های فارسی برای مشترکانی که زبان فارسی انتخاب کرده‌اند ارسال می‌شود.'
              : 'Persian emails are sent to subscribers who chose Persian.'}
          </p>
        </div>
      </form>
    </div>
  );
}
