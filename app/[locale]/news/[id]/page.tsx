import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/db/news';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  const n = await getNewsItem(id);
  return { title: n ? (locale === 'fa' ? n.titleFa : n.titleEn) : 'News' };
}

export default async function NewsItemPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const isFa = locale === 'fa';
  const n = await getNewsItem(id);
  if (!n) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/news" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← {isFa ? 'بازگشت به اخبار' : 'Back to News'}
      </Link>

      {n.imageUrl && (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6">
          <Image src={n.imageUrl} alt={isFa ? n.titleFa : n.titleEn} fill className="object-cover" />
        </div>
      )}

      <p className="text-xs text-text-muted font-body mb-2">
        {new Date(n.publishedAt).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </p>
      <h1 className="font-heading text-3xl font-bold text-primary mb-6">
        {isFa ? n.titleFa : n.titleEn}
      </h1>
      <div className="font-body text-text leading-relaxed whitespace-pre-wrap">
        {isFa ? n.bodyFa : n.bodyEn}
      </div>
    </div>
  );
}
