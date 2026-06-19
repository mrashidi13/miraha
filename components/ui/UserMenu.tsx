'use client';

import { useRef, useEffect, useState, useTransition } from 'react';
import { Link } from '@/i18n/navigation';
import { actionSignOut } from '@/app/actions/auth';

interface Props {
  email: string;
  isAdmin: boolean;
  locale: string;
}

export function UserMenu({ email, isAdmin, locale }: Props) {
  const isFa = locale === 'fa';
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSignOut() {
    startTransition(() => actionSignOut(locale));
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-heading font-bold hover:bg-primary/80 transition-colors ring-2 ring-transparent hover:ring-primary/30"
        title={email}
      >
        {initial}
      </button>

      {open && (
        <div
          className={`absolute top-11 z-50 w-56 bg-bg border border-primary/20 rounded-2xl shadow-xl overflow-hidden ${isFa ? 'right-0' : 'right-0'}`}
          dir={isFa ? 'rtl' : 'ltr'}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-primary/10 bg-primary-light">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-base flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-body text-text-muted">{isFa ? 'وارد شده با' : 'Signed in as'}</p>
                <p className="text-sm font-body text-primary font-medium truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-text hover:bg-primary-light hover:text-primary transition-colors"
            >
              <span className="text-base">👤</span>
              {isFa ? 'پروفایل من' : 'My Profile'}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-text hover:bg-primary-light hover:text-primary transition-colors"
              >
                <span className="text-base">⚙️</span>
                {isFa ? 'پنل مدیریت' : 'Admin Panel'}
              </Link>
            )}

            <div className="h-px bg-primary/10 mx-3 my-1" />

            <button
              onClick={handleSignOut}
              disabled={pending}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <span className="text-base">🚪</span>
              {pending ? (isFa ? 'در حال خروج…' : 'Signing out…') : (isFa ? 'خروج از حساب' : 'Sign out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
