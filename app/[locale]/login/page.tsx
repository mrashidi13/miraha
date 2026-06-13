import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Login' };

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string; message?: string; tab?: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  // Already logged in → go to next or home
  const user = await getServerUser();
  if (user) {
    const { next } = await searchParams;
    redirect(next ?? `/${locale}`);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-16 bg-primary-light">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-primary/20 shadow-sm p-8">
        <h1 className="font-heading text-2xl font-bold text-primary text-center mb-6">
          {isFa ? 'ورود به میراها' : 'Sign in to Miraha'}
        </h1>
        <Suspense>
          <LoginForm locale={locale} isFa={isFa} />
        </Suspense>
      </div>
    </div>
  );
}
