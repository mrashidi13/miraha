import { notFound } from 'next/navigation';
import { getProverb } from '@/lib/db/proverbs';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { CommentSection } from '@/components/ui/CommentSection';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getProverb(id);
  return { title: p?.textEn ?? 'Proverb' };
}

export default async function ProverbPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale, id } = await params;
  const sp = await searchParams;
  const isFa = locale === 'fa';
  const p = await getProverb(id);
  if (!p) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/proverbs" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← {isFa ? 'بازگشت به ضرب‌المثل‌ها' : 'Back to Proverbs'}
      </Link>

      <div className="bg-primary-light border border-primary/20 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="font-heading text-2xl font-semibold text-primary leading-snug">
            {isFa ? p.textFa : p.textEn}
          </p>
          {p.audioUrl && <AudioPlayer src={p.audioUrl} />}
        </div>

        <div className="space-y-3 font-body text-sm">
          <div>
            <p className="text-text-muted uppercase text-xs tracking-wider mb-1">{isFa ? 'معنی' : 'Meaning'}</p>
            <p className="text-text">{isFa ? p.meaningFa : p.meaningEn}</p>
          </div>
          {(p.usageEn || p.usageFa) && (
            <div>
              <p className="text-text-muted uppercase text-xs tracking-wider mb-1">{isFa ? 'کاربرد' : 'When used'}</p>
              <p className="text-text">{isFa ? p.usageFa : p.usageEn}</p>
            </div>
          )}
        </div>
      </div>

      <CommentSection targetType="proverb" targetId={p.id} locale={locale} showSuccess={sp.commented === '1'} />
    </div>
  );
}
