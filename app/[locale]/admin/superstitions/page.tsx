import { getAllSuperstitions } from '@/lib/db/superstitions';
import { actionCreateSuperstition, actionUpdateSuperstition, actionDeleteSuperstition } from '@/app/actions/superstitions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { Link } from '@/i18n/navigation';
import type { Superstition } from '@prisma/client';

function Field({ label, name, defaultValue = '', dir }: { label: string; name: string; defaultValue?: string; dir?: string }) {
  return (
    <div>
      <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">{label}</label>
      <textarea
        name={name}
        rows={2}
        defaultValue={defaultValue}
        dir={dir}
        className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary resize-none"
      />
    </div>
  );
}

export default async function SuperstitionsAdminPage() {
  const superstitions = await getAllSuperstitions();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-8">Superstitions / خرافات</h1>

      {/* Create */}
      <form action={actionCreateSuperstition} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-10">
        <h2 className="font-heading text-base font-semibold text-primary">Add New</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Text (EN)" name="textEn" />
          <Field label="متن (FA)" name="textFa" dir="rtl" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Explanation (EN)" name="explanationEn" />
          <Field label="توضیح (FA)" name="explanationFa" dir="rtl" />
        </div>
        <div>
          <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Category (optional)</label>
          <input name="category" className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" placeholder="e.g. weather, health, animals" />
        </div>
        <SubmitButton label="Add Superstition" />
      </form>

      {/* List */}
      <div className="space-y-4">
        {superstitions.length === 0 ? (
          <p className="text-text-muted font-body text-sm">No superstitions yet.</p>
        ) : (
          superstitions.map((s: Superstition) => (
            <div key={s.id} className="bg-bg border border-primary/20 rounded-2xl p-5">
              <form action={actionUpdateSuperstition} className="space-y-3">
                <input type="hidden" name="id" value={s.id} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Text (EN)" name="textEn" defaultValue={s.textEn} />
                  <Field label="متن (FA)" name="textFa" defaultValue={s.textFa} dir="rtl" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Explanation (EN)" name="explanationEn" defaultValue={s.explanationEn} />
                  <Field label="توضیح (FA)" name="explanationFa" defaultValue={s.explanationFa} dir="rtl" />
                </div>
                <div>
                  <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">Category</label>
                  <input name="category" defaultValue={s.category} className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <SubmitButton label="Save" />
                  <form action={actionDeleteSuperstition.bind(null, s.id)}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-body transition-colors">Delete</button>
                  </form>
                </div>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
