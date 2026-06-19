'use client';

import { useRef, useEffect, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { actionSignInWithEmailInline, actionSignInWithGoogle } from '@/app/actions/auth';

interface Props {
  locale: string;
}

export function LoginDropdown({ locale }: Props) {
  const isFa = locale === 'fa';
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;
    startTransition(async () => {
      const result = await actionSignInWithEmailInline(email, password, locale);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  function handleGoogle() {
    startTransition(() => actionSignInWithGoogle(locale));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
      >
        {isFa ? 'ورود' : 'Login'}
      </button>

      {open && (
        <div
          className="absolute top-11 end-0 z-50 w-72 bg-bg border border-primary/20 rounded-2xl shadow-xl overflow-hidden"
          dir={isFa ? 'rtl' : 'ltr'}
        >
          <div className="px-4 py-3 border-b border-primary/10 bg-primary-light">
            <p className="font-heading text-base font-semibold text-primary">
              {isFa ? 'ورود به میراها' : 'Sign in to Miraha'}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-sm font-body text-text hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isFa ? 'ادامه با گوگل' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-primary/15" />
              <span className="text-xs text-text-muted font-body">{isFa ? 'یا' : 'or'}</span>
              <div className="flex-1 h-px bg-primary/15" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmail} className="space-y-2">
              <input
                name="email"
                type="email"
                required
                dir={isFa ? 'rtl' : 'ltr'}
                placeholder={isFa ? 'ایمیل' : 'Email'}
                className="w-full px-3 py-2 rounded-xl border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <input
                name="password"
                type="password"
                required
                dir={isFa ? 'rtl' : 'ltr'}
                placeholder={isFa ? 'رمز عبور' : 'Password'}
                className="w-full px-3 py-2 rounded-xl border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary transition-colors"
              />
              {error && (
                <p className="text-xs text-red-600 font-body">{error}</p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="w-full py-2 rounded-xl bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {pending ? (isFa ? 'در حال ورود…' : 'Signing in…') : (isFa ? 'ورود' : 'Sign in')}
              </button>
            </form>

            {/* Link to full login page */}
            <p className="text-center text-xs text-text-muted font-body">
              <a
                href={locale === 'en' ? '/en/login?tab=signup' : '/login?tab=signup'}
                onClick={() => setOpen(false)}
                className="text-accent hover:underline"
              >
                {isFa ? 'حساب ندارید؟ ثبت‌نام کنید' : "No account? Sign up"}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
