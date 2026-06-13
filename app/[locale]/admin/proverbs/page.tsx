import { Link } from '@/i18n/navigation';
import { getProverbs } from '@/lib/db/proverbs';

export default async function AdminProverbsPage() {
  const proverbs = await getProverbs('approved');
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Proverbs</h1>
        <Link href="/admin/proverbs/new" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover">+ Add Proverb</Link>
      </div>
      <div className="space-y-2">
        {proverbs.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3">
            <p className="font-body text-sm text-text truncate max-w-md">{p.textEn}</p>
            <Link href={`/admin/proverbs/${p.id}`} className="text-xs text-accent hover:underline font-body ml-4 flex-shrink-0">Edit</Link>
          </div>
        ))}
        {proverbs.length === 0 && <p className="text-text-muted font-body text-sm">No proverbs yet.</p>}
      </div>
    </div>
  );
}
