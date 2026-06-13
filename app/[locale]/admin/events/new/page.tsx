import { actionCreateEvent } from '@/app/actions/events';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/events" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">New Event</h1>
      <form action={actionCreateEvent} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" required />
          <InputField label="Title (Persian / فارسی)" name="titleFa" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Description (English)" name="descriptionEn" rows={3} />
          <TextareaField label="Description (Persian / فارسی)" name="descriptionFa" rows={3} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Starts at" name="startsAt" type="datetime-local" required />
          <InputField label="Ends at" name="endsAt" type="datetime-local" />
        </div>
        <InputField label="Location" name="location" />
        <SubmitButton label="Add Event" />
      </form>
    </div>
  );
}
