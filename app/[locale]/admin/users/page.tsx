import { getAllUsers } from '@/lib/db/users';
import { actionSetUserRole, actionTogglePermission } from '@/app/actions/users';
import { Link } from '@/i18n/navigation';

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-2">Users & Permissions</h1>
      <p className="text-sm text-text-muted font-body mb-8">
        Grant contributors the ability to publish content directly without moderation.
        Members without these flags must still go through the approval queue.
      </p>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-bg border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-primary text-sm">{u.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${
                    u.role === 'admin'
                      ? 'bg-primary text-white'
                      : 'bg-primary-light text-primary'
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <p className="text-xs text-text-muted font-body mt-0.5">{u.email}</p>
            </div>

            {/* Role toggle */}
            {u.role !== 'admin' && (
              <div className="flex flex-wrap gap-3 items-center">
                <PermissionToggle
                  label="Publish Words"
                  checked={u.canPublishWords}
                  action={actionTogglePermission.bind(null, u.id, 'canPublishWords', !u.canPublishWords)}
                />
                <PermissionToggle
                  label="Publish Proverbs"
                  checked={u.canPublishProverbs}
                  action={actionTogglePermission.bind(null, u.id, 'canPublishProverbs', !u.canPublishProverbs)}
                />
                <PermissionToggle
                  label="Publish Media"
                  checked={u.canPublishMedia}
                  action={actionTogglePermission.bind(null, u.id, 'canPublishMedia', !u.canPublishMedia)}
                />
                <form action={actionSetUserRole.bind(null, u.id, 'admin')}>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 font-body text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    Make admin
                  </button>
                </form>
              </div>
            )}

            {u.role === 'admin' && (
              <span className="text-xs text-text-muted font-body italic">Full access — all permissions included</span>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-text-muted font-body text-sm">No users yet.</p>
        )}
      </div>
    </div>
  );
}

function PermissionToggle({
  label,
  checked,
  action,
}: {
  label: string;
  checked: boolean;
  action: () => Promise<void>;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-body transition-colors ${
          checked
            ? 'bg-accent text-white border-accent hover:bg-accent-hover'
            : 'border-primary/30 text-text-muted hover:border-primary hover:text-primary'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${checked ? 'bg-white' : 'bg-text-muted'}`} />
        {label}
      </button>
    </form>
  );
}
