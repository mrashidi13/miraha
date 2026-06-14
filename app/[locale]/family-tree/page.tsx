import { getPeopleWithRelations } from '@/lib/db/people';
import { FamilyTree } from '@/components/ui/FamilyTree';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Family Tree' };

export default async function FamilyTreePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const people = await getPeopleWithRelations();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Slim header bar */}
      <div className="flex-shrink-0 border-b border-primary/10 bg-bg px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/people" className="text-sm text-accent hover:underline font-body">
            ← {isFa ? 'فهرست مردم' : 'People directory'}
          </Link>
          <span className="text-text-muted/40">·</span>
          <h1 className="font-heading font-semibold text-primary text-sm">
            {isFa ? 'درخت خانوادگی' : 'Family Tree'}
          </h1>
        </div>
        <p className="text-xs text-text-muted font-body hidden sm:block">
          {isFa
            ? `${people.length} نفر — روی هر کارت کلیک کنید`
            : `${people.length} people — click any card for details`}
        </p>
      </div>

      {/* Full-height canvas */}
      <div className="flex-1 min-h-0">
        <FamilyTree people={people} locale={locale} />
      </div>
    </div>
  );
}
