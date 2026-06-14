import { notFound } from 'next/navigation';
import { getPerson, getPeople } from '@/lib/db/people';
import { actionUpdatePerson, actionDeletePerson } from '@/app/actions/people';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, allPeople] = await Promise.all([getPerson(id), getPeople()]);
  if (!p) notFound();

  const others = allPeople.filter((x) => x.id !== id);
  const update = actionUpdatePerson.bind(null, id);
  const del = actionDeletePerson.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/people" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit: {p.nameEn}</h1>

      <form action={update} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Name (English)" name="nameEn" defaultValue={p.nameEn} required />
          <InputField label="Name (Persian)" name="nameFa" defaultValue={p.nameFa} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Role (English)" name="roleEn" defaultValue={p.roleEn ?? ''} />
          <InputField label="Role (Persian)" name="roleFa" defaultValue={p.roleFa ?? ''} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Location (English)" name="locationEn" defaultValue={p.locationEn ?? ''} />
          <InputField label="Location (Persian)" name="locationFa" defaultValue={p.locationFa ?? ''} />
        </div>

        {/* Birth / death year */}
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Birth Year" name="birthYear" defaultValue={p.birthYear?.toString() ?? ''} />
          <InputField label="Death Year" name="deathYear" defaultValue={p.deathYear?.toString() ?? ''} />
        </div>

        {/* Family tree relationships */}
        <div className="border-t border-primary/10 pt-4">
          <p className="text-xs text-text-muted font-body uppercase tracking-wider mb-3">Family tree</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body text-text-muted mb-1">Father</label>
              <select
                name="fatherId"
                defaultValue={p.fatherId ?? ''}
                className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary"
              >
                <option value="">— none —</option>
                {others.map((o) => (
                  <option key={o.id} value={o.id}>{o.nameEn} · {o.nameFa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-body text-text-muted mb-1">Mother</label>
              <select
                name="motherId"
                defaultValue={p.motherId ?? ''}
                className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary"
              >
                <option value="">— none —</option>
                {others.map((o) => (
                  <option key={o.id} value={o.id}>{o.nameEn} · {o.nameFa}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ImageUpload name="photoUrl" initialUrl={p.photoUrl ?? undefined} label="Photo" />
        <SubmitButton label="Save Changes" />
      </form>

      <form action={del}><DeleteButton /></form>
    </div>
  );
}
