// Root layout is intentionally minimal.
// The [locale]/layout.tsx provides the actual <html> and <body> elements
// with locale-aware lang, dir, fonts, and theme CSS variables.
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
