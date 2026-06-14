import { getMedia, createMediaItem, deleteMediaItem } from '@/lib/db/media';
import { revalidatePath } from 'next/cache';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { MediaType } from '@prisma/client';

async function actionAddMedia(formData: FormData) {
  'use server';
  const url = formData.get('url') as string;
  if (!url) return;
  await createMediaItem({
    type: formData.get('type') as MediaType,
    url,
    captionEn: (formData.get('captionEn') as string) || undefined,
    captionFa: (formData.get('captionFa') as string) || undefined,
  });
  revalidatePath('/[locale]/gallery', 'page');
}

async function actionDeleteMedia(id: string) {
  'use server';
  await deleteMediaItem(id);
  revalidatePath('/[locale]/gallery', 'page');
}

export default async function AdminMediaPage() {
  const media = await getMedia();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Media / Gallery</h1>

      <form action={actionAddMedia} className="bg-bg border border-primary/20 rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="font-heading text-base font-semibold text-primary">Add media item</h2>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted font-body font-medium uppercase tracking-wider">Type</label>
          <select name="type" className="rounded-lg border border-primary/30 px-3 py-2 font-body text-sm bg-bg focus:outline-none focus:border-primary w-40">
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <ImageUpload name="url" label="File / Image" />
        <div className="grid sm:grid-cols-2 gap-3">
          <InputField label="Caption (English)" name="captionEn" />
          <InputField label="Caption (Persian / فارسی)" name="captionFa" />
        </div>
        <SubmitButton label="Add" />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {media.map((m) => (
          <div key={m.id} className="relative group rounded-xl overflow-hidden border border-primary/20">
            {m.type === 'photo' ? (
              <div className="relative aspect-square">
                <Image src={m.url} alt={m.captionEn ?? ''} fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-primary-light flex items-center justify-center">
                <span className="text-3xl">{m.type === 'video' ? '🎬' : '🎙️'}</span>
              </div>
            )}
            <div className="p-2 bg-bg text-xs font-body text-text-muted truncate">{m.captionEn || m.url}</div>
            <form action={actionDeleteMedia.bind(null, m.id)} className="absolute top-1 end-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="submit" className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-700">×</button>
            </form>
          </div>
        ))}
        {media.length === 0 && <p className="col-span-full text-text-muted font-body text-sm">No media yet.</p>}
      </div>
    </div>
  );
}
