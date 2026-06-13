import { Link } from '@/i18n/navigation';
import { getWords } from '@/lib/db/words';

export default async function AdminWordsPage() {
  const words = await getWords({ status: 'approved' });
  const pending = await getWords({ status: 'pending' });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Words</h1>
        <Link href="/admin/words/new" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors">
          + Add Word
        </Link>
      </div>

      {pending.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-body text-yellow-800 font-semibold mb-2">⏳ Pending approval ({pending.length})</p>
          {pending.map((w) => (
            <Link key={w.id} href={`/admin/words/${w.id}`} className="block text-sm text-yellow-700 hover:underline">
              {w.term}
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {words.map((w) => (
          <div key={w.id} className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3">
            <div>
              <span className="font-heading font-semibold text-primary">{w.term}</span>
              <span className="text-sm text-text-muted font-body ml-3">{w.meaningEn}</span>
            </div>
            <Link href={`/admin/words/${w.id}`} className="text-xs text-accent hover:underline font-body">
              Edit
            </Link>
          </div>
        ))}
        {words.length === 0 && <p className="text-text-muted font-body text-sm">No words yet.</p>}
      </div>
    </div>
  );
}
