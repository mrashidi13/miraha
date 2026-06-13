import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/db/news';
import { actionUpdateNews, actionDeleteNews } from '@/app/actions/news';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await getNewsItem(id);
  if (!n) notFound();
  const update = actionUpdateNews.bind(null, id);
  const del = actionDeleteNews.bind(null, id);
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/news" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Back</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit Article</h1>
      <form action={update} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" defaultValue={n.titleEn} required />
          <InputField label="Title (Persian)" name="titleFa" defaultValue={n.titleFa} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Body (English)" name="bodyEn" defaultValue={n.bodyEn} required rows={6} />
          <TextareaField label="Body (Persian)" name="bodyFa" defaultValue={n.bodyFa} required rows={6} />
        </div>
        <InputField label="Image URL" name="imageUrl" defaultValue={n.imageUrl ?? ''} type="url" />
        <SubmitButton label="Save Changes" />
      </form>
      <form action={del}><DeleteButton /></form>
    </div>
  );
}
