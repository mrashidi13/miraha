import { actionCreateProverb } from '@/app/actions/proverbs';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default function NewProverbPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/proverbs" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">New Proverb</h1>
      <form action={actionCreateProverb} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Proverb (English)" name="textEn" required rows={2} />
          <TextareaField label="Proverb (Persian / فارسی)" name="textFa" required rows={2} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Meaning (English)" name="meaningEn" required rows={3} />
          <TextareaField label="Meaning (Persian / فارسی)" name="meaningFa" required rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="When used (English)" name="usageEn" rows={2} />
          <TextareaField label="When used (Persian / فارسی)" name="usageFa" rows={2} />
        </div>
        <InputField label="Audio URL" name="audioUrl" type="url" />
        <SubmitButton label="Add Proverb" />
      </form>
    </div>
  );
}
