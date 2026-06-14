import { notFound } from 'next/navigation';
import { getWord } from '@/lib/db/words';
import { getProverbsContaining } from '@/lib/db/proverbs';
import { getFavorite } from '@/lib/db/favorites';
import { getServerUser } from '@/lib/supabase/server';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
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

  const [word, user] = await Promise.all([getWord(id), getServerUser()]);
  if (!word) notFound();

  const [isFavorited, relatedProverbs] = await Promise.all([
    user ? getFavorite(user.id, word.id).then(Boolean) : Promise.resolve(false),
    getProverbsContaining(word.term, word.pronunciation),
  ]);

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
          <div className="flex items-center gap-2 flex-shrink-0">
            {word.audioUrl && <AudioPlayer src={word.audioUrl} />}
            {user && (
              <FavoriteButton wordId={word.id} initialFavorited={isFavorited} locale={locale} />
            )}
          </div>
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

      {!user && (
        <p className="text-center text-sm text-text-muted font-body mt-6">
          <Link href="/login" className="text-accent hover:underline">
            {isFa ? 'وارد شوید' : 'Sign in'}
          </Link>{' '}
          {isFa ? 'تا این واژه را ذخیره کنید.' : 'to save this word to your favorites.'}
        </p>
      )}

      {relatedProverbs.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-primary mb-4">
            {isFa ? 'ضرب‌المثل‌های مرتبط' : 'Related Proverbs'}
          </h2>
          <div className="space-y-3">
            {relatedProverbs.map((p) => (
              <Link
                key={p.id}
                href={`/proverbs/${p.id}`}
                className="block bg-bg border border-primary/20 rounded-xl px-4 py-3 hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <p className="font-heading text-sm font-semibold text-primary leading-snug mb-1 group-hover:text-primary/80 transition-colors">
                  {isFa ? p.textFa : p.textEn}
                </p>
                <p className="text-xs text-text-muted font-body">
                  {isFa ? p.meaningFa : p.meaningEn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
