import { actionCreateNews } from '@/app/actions/news';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default function NewNewsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/news" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">New News Article</h1>
      <form action={actionCreateNews} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" required />
          <InputField label="Title (Persian / فارسی)" name="titleFa" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Body (English)" name="bodyEn" required rows={6} />
          <TextareaField label="Body (Persian / فارسی)" name="bodyFa" required rows={6} />
        </div>
        <InputField label="Image URL" name="imageUrl" type="url" />
        <SubmitButton label="Publish" />
      </form>
    </div>
  );
}
