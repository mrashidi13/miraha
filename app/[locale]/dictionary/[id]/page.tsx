import { notFound } from 'next/navigation';
import { getWord } from '@/lib/db/words';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const word = await getWord(id);
  return { title: word?.term ?? 'Word' };
}

export default async function WordPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const isFa = locale === 'fa';
  const word = await getWord(id);
  if (!word) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/dictionary" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← {isFa ? 'بازگشت به واژه‌نامه' : 'Back to Dictionary'}
      </Link>

      <div className="bg-bg border border-primary/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary">{word.term}</h1>
            {word.pronunciation && (
              <p className="text-text-muted font-body text-sm mt-1">/{word.pronunciation}/</p>
            )}
          </div>
          {word.audioUrl && <AudioPlayer src={word.audioUrl} />}
        </div>

        {word.photoUrl && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
            <Image src={word.photoUrl} alt={word.term} fill className="object-cover" />
          </div>
        )}

        <div className="space-y-4 font-body text-sm">
          <div>
            <p className="text-text-muted uppercase text-xs tracking-wider mb-1">
              {isFa ? 'معنی' : 'Meaning'}
            </p>
            <p className="text-text">{isFa ? word.meaningFa : word.meaningEn}</p>
          </div>

          {(word.exampleEn || word.exampleFa) && (
            <div>
              <p className="text-text-muted uppercase text-xs tracking-wider mb-1">
                {isFa ? 'مثال' : 'Example'}
              </p>
              <p className="text-text italic">{isFa ? word.exampleFa : word.exampleEn}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
