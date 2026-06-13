'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  actionSignInWithEmail,
  actionSignUpWithEmail,
  actionSignInWithGoogle,
} from '@/app/actions/auth';
import { SubmitButton } from '@/components/admin/SubmitButton';

interface Props {
  locale: string;
  isFa: boolean;
}

const T = {
  en: {
    email: 'Email', password: 'Password', name: 'Full name',
    signIn: 'Sign in', signUp: 'Create account',
    google: 'Continue with Google',
    haveAccount: 'Already have an account?', noAccount: 'No account?',
    checkEmail: 'Check your email to confirm your address.',
    or: 'or',
  },
  fa: {
    email: 'ایمیل', password: 'رمز عبور', name: 'نام کامل',
    signIn: 'ورود', signUp: 'ساخت حساب',
    google: 'ادامه با گوگل',
    haveAccount: 'حساب دارید؟', noAccount: 'حساب ندارید؟',
    checkEmail: 'ایمیل را برای تأیید آدرس خود بررسی کنید.',
    or: 'یا',
  },
} as const;

export function LoginForm({ locale, isFa }: Props) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'signin' | 'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'signin',
  );

  const t = T[isFa ? 'fa' : 'en'];
  const next = searchParams.get('next') ?? `/${locale}`;
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  const googleAction = actionSignInWithGoogle.bind(null, locale);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tab switcher */}
      <div className="flex rounded-xl overflow-hidden border border-primary/30 mb-6">
        {(['signin', 'signup'] as const).map((t2) => (
          <button
            key={t2}
            onClick={() => setTab(t2)}
            className={`flex-1 py-2 text-sm font-body transition-colors ${
              tab === t2
                ? 'bg-primary text-white'
                : 'bg-bg text-text-muted hover:bg-primary-light'
            }`}
          >
            {t2 === 'signin' ? t.signIn : t.signUp}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-body">
          {decodeURIComponent(error)}
        </div>
      )}
      {message === 'check_email' && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-body">
          {t.checkEmail}
        </div>
      )}

      {/* Google */}
      <form action={googleAction} className="mb-4">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-primary/30 bg-bg font-body text-sm text-text hover:bg-primary-light transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t.google}
        </button>
      </form>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 border-t border-primary/20" />
        <span className="text-xs text-text-muted font-body">{t.or}</span>
        <div className="flex-1 border-t border-primary/20" />
      </div>

      {/* Email form */}
      {tab === 'signin' ? (
        <form action={actionSignInWithEmail} className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">{t.email}</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">{t.password}</label>
            <input name="password" type="password" required autoComplete="current-password"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary" />
          </div>
          <SubmitButton label={t.signIn} />
        </form>
      ) : (
        <form action={actionSignUpWithEmail} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">{t.name}</label>
            <input name="name" type="text" required autoComplete="name"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">{t.email}</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs text-text-muted font-body mb-1">{t.password}</label>
            <input name="password" type="password" required autoComplete="new-password" minLength={6}
              className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-body bg-bg focus:outline-none focus:border-primary" />
          </div>
          <SubmitButton label={t.signUp} />
        </form>
      )}
    </div>
  );
}
