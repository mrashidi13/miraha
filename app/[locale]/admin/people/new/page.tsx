import { actionCreatePerson } from '@/app/actions/people';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default function NewPersonPage() {
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
        <InputField label="Photo URL" name="photoUrl" type="url" />
        <SubmitButton label="Add Person" />
      </form>
    </div>
  );
}
