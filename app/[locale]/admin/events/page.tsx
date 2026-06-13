import { Link } from '@/i18n/navigation';
import { getEvents } from '@/lib/db/events';

export default async function AdminEventsPage() {
  const events = await getEvents();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Events</h1>
        <Link href="/admin/events/new" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover">+ Add Event</Link>
      </div>
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between bg-bg border border-primary/20 rounded-xl px-4 py-3">
            <div>
              <p className="font-body font-medium text-text text-sm">{e.titleEn}</p>
              <p className="text-xs text-text-muted font-body">{new Date(e.startsAt).toLocaleDateString()}</p>
            </div>
            <Link href={`/admin/events/${e.id}`} className="text-xs text-accent hover:underline font-body">Edit</Link>
          </div>
        ))}
        {events.length === 0 && <p className="text-text-muted font-body text-sm">No events yet.</p>}
      </div>
    </div>
  );
}
