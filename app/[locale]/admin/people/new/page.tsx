import { getPeople } from '@/lib/db/people';
import { actionCreatePerson } from '@/app/actions/people';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';

export default async function NewPersonPage() {
  const allPeople = await getPeople();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/people" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Add Person</h1>

      <form action={actionCreatePerson} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Name (English)" name="nameEn" required />
          <InputField label="Name (Persian / فارسی)" name="nameFa" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Role (English)" name="roleEn" />
          <InputField label="Role (Persian / فارسی)" name="roleFa" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Location (English)" name="locationEn" />
          <InputField label="Location (Persian / فارسی)" name="locationFa" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Birth Year" name="birthYear" />
          <InputField label="Death Year" name="deathYear" />
        </div>

        {allPeople.length > 0 && (
          <div className="border-t border-primary/10 pt-4">
            <p className="text-xs text-text-muted font-body uppercase tracking-wider mb-3">Family tree</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body text-text-muted mb-1">Father</label>
                <select
                  name="fatherId"
                  defaultValue=""
                  className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="">— none —</option>
                  {allPeople.map((p) => (
                    <option key={p.id} value={p.id}>{p.nameEn} · {p.nameFa}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-body text-text-muted mb-1">Mother</label>
                <select
                  name="motherId"
                  defaultValue=""
                  className="w-full rounded-xl border border-primary/30 bg-bg px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="">— none —</option>
                  {allPeople.map((p) => (
                    <option key={p.id} value={p.id}>{p.nameEn} · {p.nameFa}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Hidden fields with empty defaults when no people exist yet */}
        {allPeople.length === 0 && (
          <>
            <input type="hidden" name="fatherId" value="" />
            <input type="hidden" name="motherId" value="" />
          </>
        )}

        <ImageUpload name="photoUrl" label="Photo" />
        <SubmitButton label="Add Person" />
      </form>
    </div>
  );
}
