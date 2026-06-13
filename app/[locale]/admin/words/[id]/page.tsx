import { notFound } from 'next/navigation';
import { getWord } from '@/lib/db/words';
import { actionUpdateWord, actionDeleteWord, actionApproveWord, actionRejectWord } from '@/app/actions/words';
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
  const approveWithId = actionApproveWord.bind(null, id);
  const rejectWithId = actionRejectWord.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/words" className="text-sm text-accent hover:underline font-body mb-6 inline-block">
        ← Back to Words
      </Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit: {word.term}</h1>

      {word.status === 'pending' && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <p className="text-sm font-body text-yellow-800 font-semibold mb-3">
            ⏳ Pending approval — submitted by a member
          </p>
          <div className="flex gap-3">
            <form action={approveWithId}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
              >
                Approve
              </button>
            </form>
            <form action={rejectWithId}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-body hover:bg-red-50 transition-colors"
              >
                Reject &amp; Delete
              </button>
            </form>
          </div>
        </div>
      )}

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
