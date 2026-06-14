'use client';

import { useActionState } from 'react';
import { actionSubscribe } from '@/app/actions/newsletter';
import { useTranslations } from 'next-intl';

export function NewsletterSignup({ locale }: { locale: string }) {
  const t = useTranslations('site');
  const isFa = locale === 'fa';

  const [result, dispatch, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set('locale', locale);
      return actionSubscribe(formData);
    },
    null,
  );

  if (result?.ok) {
    return (
      <div className="text-center py-2">
        <p className="text-sm font-body text-accent font-medium">
          {isFa ? 'عضویت شما ثبت شد. ممنون!' : 'You\'re subscribed. Thank you!'}
        </p>
      </div>
    );
  }

  return (
    <form action={dispatch} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-center">
      <input
        name="name"
        placeholder={isFa ? 'نام (اختیاری)' : 'Name (optional)'}
        dir={isFa ? 'rtl' : 'ltr'}
        className="rounded-lg border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary w-full sm:w-36"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={isFa ? 'آدرس ایمیل' : 'Email address'}
        className="rounded-lg border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary w-full sm:w-56"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-accent text-white px-4 py-2 font-body text-sm hover:bg-accent-hover transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {isPending
          ? (isFa ? 'در حال ثبت…' : 'Subscribing…')
          : (isFa ? 'عضویت در خبرنامه' : 'Subscribe')}
      </button>
      {result?.error === 'invalid_email' && (
        <p className="text-xs text-red-500 font-body sm:absolute sm:mt-10">
          {isFa ? 'ایمیل معتبر وارد کنید.' : 'Please enter a valid email.'}
        </p>
      )}
    </form>
  );
}
