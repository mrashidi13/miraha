import { notFound } from 'next/navigation';
import { getProverb } from '@/lib/db/proverbs';
import { actionUpdateProverb, actionDeleteProverb } from '@/app/actions/proverbs';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function EditProverbPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProverb(id);
  if (!p) notFound();
  const update = actionUpdateProverb.bind(null, id);
  const del = actionDeleteProverb.bind(null, id);
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/proverbs" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit Proverb</h1>
      <form action={update} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Proverb (English)" name="textEn" defaultValue={p.textEn} required rows={2} />
          <TextareaField label="Proverb (Persian)" name="textFa" defaultValue={p.textFa} required rows={2} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Meaning (English)" name="meaningEn" defaultValue={p.meaningEn} required rows={3} />
          <TextareaField label="Meaning (Persian)" name="meaningFa" defaultValue={p.meaningFa} required rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="When used (English)" name="usageEn" defaultValue={p.usageEn ?? ''} rows={2} />
          <TextareaField label="When used (Persian)" name="usageFa" defaultValue={p.usageFa ?? ''} rows={2} />
        </div>
        <InputField label="Audio URL" name="audioUrl" defaultValue={p.audioUrl ?? ''} type="url" />
        <SubmitButton label="Save Changes" />
      </form>
      <form action={del}><DeleteButton /></form>
    </div>
  );
}
