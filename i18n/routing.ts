import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'fa',
  localePrefix: 'as-needed', // fa (default) gets no prefix; en gets /en/
  localeDetection: false,    // never redirect based on Accept-Language; always use defaultLocale for /
});
