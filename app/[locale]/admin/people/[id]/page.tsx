import { notFound } from 'next/navigation';
import { getPerson } from '@/lib/db/people';
import { actionUpdatePerson, actionDeletePerson } from '@/app/actions/people';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPerson(id);
  if (!p) notFound();
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
        <InputField label="Photo URL" name="photoUrl" defaultValue={p.photoUrl ?? ''} type="url" />
        <SubmitButton label="Save Changes" />
      </form>
      <form action={del}><DeleteButton /></form>
    </div>
  );
}
