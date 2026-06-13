import { notFound } from 'next/navigation';
import { getWord } from '@/lib/db/words';
import { actionUpdateWord, actionDeleteWord } from '@/app/actions/words';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function EditWordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const word = await getWord(id);
  if (!word) notFound();

  const updateWithId = actionUpdateWord.bind(null, id);
  const deleteWithId = actionDeleteWord.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/words" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← Back to Words
      </Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit: {word.term}</h1>

      <form action={updateWithId} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Village word (term)" name="term" defaultValue={word.term} required />
          <InputField label="Pronunciation" name="pronunciation" defaultValue={word.pronunciation ?? ''} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Meaning (English)" name="meaningEn" defaultValue={word.meaningEn} required rows={3} />
          <TextareaField label="Meaning (Persian / فارسی)" name="meaningFa" defaultValue={word.meaningFa} required rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Example (English)" name="exampleEn" defaultValue={word.exampleEn ?? ''} rows={2} />
          <TextareaField label="Example (Persian / فارسی)" name="exampleFa" defaultValue={word.exampleFa ?? ''} rows={2} />
        </div>
        <InputField label="Audio URL" name="audioUrl" defaultValue={word.audioUrl ?? ''} type="url" />
        <InputField label="Photo URL" name="photoUrl" defaultValue={word.photoUrl ?? ''} type="url" />
        <div className="pt-2">
          <SubmitButton label="Save Changes" />
        </div>
      </form>

      <form action={deleteWithId}>
        <DeleteButton />
      </form>
    </div>
  );
}
