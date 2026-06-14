import { actionCreateWord } from '@/app/actions/words';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';

export default function NewWordPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/words" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← Back to Words
      </Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">New Word</h1>

      <form action={actionCreateWord} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Village word (term)" name="term" required />
          <InputField label="Pronunciation" name="pronunciation" placeholder="e.g. larg" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Meaning (English)" name="meaningEn" required rows={3} />
          <TextareaField label="Meaning (Persian / فارسی)" name="meaningFa" required rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Example (English)" name="exampleEn" rows={2} />
          <TextareaField label="Example (Persian / فارسی)" name="exampleFa" rows={2} />
        </div>
        <InputField label="Audio URL" name="audioUrl" type="url" placeholder="https://…" />
        <ImageUpload name="photoUrl" label="Photo" />
        <div className="pt-2">
          <SubmitButton label="Add Word" />
        </div>
      </form>
    </div>
  );
}
