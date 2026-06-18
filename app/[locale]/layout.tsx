import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Fraunces, Playfair_Display, Vazirmatn } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { buildThemeCssVars } from '@/lib/theme';
import { getTheme } from '@/lib/db/settings';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '../globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return { title: { default: t('name'), template: `%s · ${t('name')}` }, description: t('tagline') };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  const [theme, supabaseUser] = await Promise.all([getTheme(), getServerUser()]);
  const themeVars = buildThemeCssVars(theme);

  const dbUser = supabaseUser ? await getUserById(supabaseUser.id) : null;
  const isAdmin = dbUser?.role === 'admin';

  return (
    <html lang={locale} dir={dir} className={`${fraunces.variable} ${playfair.variable} ${vazirmatn.variable}`}>
      <head>
        <style>{`:root { ${themeVars}; }`}</style>
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader userEmail={supabaseUser?.email} isAdmin={isAdmin} />
          <main className="flex flex-col flex-1">{children}</main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
