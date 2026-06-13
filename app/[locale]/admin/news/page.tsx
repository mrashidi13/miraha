import { Link } from '@/i18n/navigation';
import { getAllNews } from '@/lib/db/news';

export default async function AdminNewsPage() {
  const news = await getAllNews();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">News</h1>
        <Link href="/admin/news/new" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover">+ Add News</Link>
      </div>
      <div className="space-y-2">
        {news.map((n) => (
          <div key={n.id} className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3">
            <div>
              <p className="font-body font-medium text-text text-sm">{n.titleEn}</p>
              <p className="text-xs text-text-muted font-body">{new Date(n.publishedAt).toLocaleDateString()}</p>
            </div>
            <Link href={`/admin/news/${n.id}`} className="text-xs text-accent hover:underline font-body">Edit</Link>
          </div>
        ))}
        {news.length === 0 && <p className="text-text-muted font-body text-sm">No news yet.</p>}
      </div>
    </div>
  );
}
