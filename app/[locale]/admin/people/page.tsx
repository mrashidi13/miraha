import { Link } from '@/i18n/navigation';
import { getPeople } from '@/lib/db/people';

export default async function AdminPeoplePage() {
  const people = await getPeople();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">People</h1>
        <Link href="/admin/people/new" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover">+ Add Person</Link>
      </div>
      <div className="space-y-2">
        {people.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3">
            <div>
              <p className="font-body font-medium text-text text-sm">{p.nameEn} · {p.nameFa}</p>
              {p.roleEn && <p className="text-xs text-text-muted font-body">{p.roleEn}</p>}
            </div>
            <Link href={`/admin/people/${p.id}`} className="text-xs text-accent hover:underline font-body">Edit</Link>
          </div>
        ))}
        {people.length === 0 && <p className="text-text-muted font-body text-sm">No people yet.</p>}
      </div>
    </div>
  );
}
