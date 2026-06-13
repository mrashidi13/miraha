import { Link } from '@/i18n/navigation';
import { getWords } from '@/lib/db/words';
import { getProverbs } from '@/lib/db/proverbs';
import { getAllNews } from '@/lib/db/news';
import { getEvents } from '@/lib/db/events';
import { getPeople } from '@/lib/db/people';

const SECTIONS = [
  { href: '/admin/words', label: 'Words', icon: '📖' },
  { href: '/admin/proverbs', label: 'Proverbs', icon: '💬' },
  { href: '/admin/news', label: 'News', icon: '📰' },
  { href: '/admin/media', label: 'Media / Gallery', icon: '🖼️' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/people', label: 'People', icon: '👥' },
  { href: '/admin/hero', label: 'Hero Slideshow', icon: '🌅' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  { href: '/admin/appearance', label: 'Appearance', icon: '🎨' },
] as const;

export default async function AdminDashboard() {
  const [words, proverbs, news, events, people] = await Promise.all([
    getWords(), getProverbs(), getAllNews(), getEvents(), getPeople(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
      <p className="text-text-muted font-body text-sm mb-8">Manage all content and site settings here.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-3 bg-bg border border-primary/20 rounded-xl p-4 hover:border-primary/60 hover:bg-primary-light transition-colors"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="font-body font-medium text-text text-sm">{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Words', count: words.length },
          { label: 'Proverbs', count: proverbs.length },
          { label: 'News', count: news.length },
          { label: 'Events', count: events.length },
          { label: 'People', count: people.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
            <p className="font-heading text-3xl font-bold text-primary">{stat.count}</p>
            <p className="text-xs text-text-muted font-body mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
