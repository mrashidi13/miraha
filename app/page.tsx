// The next-intl middleware redirects '/' to '/en' (or the browser locale).
// This file is a fallback that should never be reached in normal operation.
import { redirect } from 'next/navigation';
export default function RootPage() {
  redirect('/en');
}
