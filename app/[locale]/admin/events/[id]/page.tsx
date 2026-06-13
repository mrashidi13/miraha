import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/db/events';
import { actionUpdateEvent, actionDeleteEvent } from '@/app/actions/events';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

function toDatetimeLocal(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getEvent(id);
  if (!e) notFound();
  const update = actionUpdateEvent.bind(null, id);
  const del = actionDeleteEvent.bind(null, id);
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/events" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit Event</h1>
      <form action={update} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" defaultValue={e.titleEn} required />
          <InputField label="Title (Persian)" name="titleFa" defaultValue={e.titleFa} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Description (English)" name="descriptionEn" defaultValue={e.descriptionEn ?? ''} rows={3} />
          <TextareaField label="Description (Persian)" name="descriptionFa" defaultValue={e.descriptionFa ?? ''} rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Starts at" name="startsAt" type="datetime-local" defaultValue={toDatetimeLocal(e.startsAt)} required />
          <InputField label="Ends at" name="endsAt" type="datetime-local" defaultValue={e.endsAt ? toDatetimeLocal(e.endsAt) : ''} />
        </div>
        <InputField label="Location" name="location" defaultValue={e.location ?? ''} />
        <SubmitButton label="Save Changes" />
      </form>
      <form action={del}><DeleteButton /></form>
    </div>
  );
}
