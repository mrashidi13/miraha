import { getAllAnnouncements } from '@/lib/db/announcements';
import { actionCreateAnnouncement, actionToggleAnnouncement, actionDeleteAnnouncement } from '@/app/actions/announcements';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { Link } from '@/i18n/navigation';
import type { Announcement } from '@prisma/client';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  general: { label: 'General', color: 'bg-primary/10 text-primary' },
  death: { label: 'Death Notice', color: 'bg-red-100 text-red-700' },
  urgent: { label: 'Urgent', color: 'bg-amber-100 text-amber-700' },
};

export default async function AnnouncementsAdminPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-8">Announcements</h1>

      {/* Create form */}
      <form action={actionCreateAnnouncement} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-10">
        <h2 className="font-heading text-base font-semibold text-primary">New Announcement</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Title (EN)</label>
            <input name="titleEn" required className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">عنوان (FA)</label>
            <input name="titleFa" required dir="rtl" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Body (EN) — optional</label>
            <textarea name="bodyEn" rows={2} className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">متن (FA) — اختیاری</label>
            <textarea name="bodyFa" rows={2} dir="rtl" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Type</label>
            <select name="type" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary">
              <option value="general">General</option>
              <option value="death">Death Notice</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Status</label>
            <select name="active" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary">
              <option value="true">Active</option>
              <option value="false">Draft</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Expires (optional)</label>
            <input type="datetime-local" name="expiresAt" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        <SubmitButton label="Create Announcement" />
      </form>

      {/* List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-text-muted font-body text-sm">No announcements yet.</p>
        ) : (
          announcements.map((a: Announcement) => {
            const meta = TYPE_LABELS[a.type] ?? TYPE_LABELS.general;
            return (
              <div key={a.id} className="flex items-start gap-3 bg-bg border border-primary/20 rounded-2xl p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-body px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    <span className={`text-xs font-body px-2 py-0.5 rounded-full ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.active ? 'Active' : 'Draft'}
                    </span>
                    {a.expiresAt && (
                      <span className="text-xs text-text-muted font-body">
                        Expires {new Date(a.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="font-heading font-semibold text-primary text-sm">{a.titleEn}</p>
                  <p className="font-body text-sm text-text" dir="rtl">{a.titleFa}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <form action={actionToggleAnnouncement.bind(null, a.id, !a.active)}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary-light font-body transition-colors">
                      {a.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
                  <form action={actionDeleteAnnouncement.bind(null, a.id)}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-body transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
