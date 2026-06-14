'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAlbum, updateAlbum, deleteAlbum, assignMediaToAlbum } from '@/lib/db/albums';

export async function actionCreateAlbum(formData: FormData) {
  const album = await createAlbum({
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || undefined,
    descriptionFa: (formData.get('descriptionFa') as string) || undefined,
    coverUrl: (formData.get('coverUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/gallery', 'page');
  redirect(`/admin/albums/${album.id}`);
}

export async function actionUpdateAlbum(id: string, formData: FormData) {
  await updateAlbum(id, {
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || undefined,
    descriptionFa: (formData.get('descriptionFa') as string) || undefined,
    coverUrl: (formData.get('coverUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/gallery', 'page');
  redirect('/admin/albums');
}

export async function actionDeleteAlbum(id: string) {
  await deleteAlbum(id);
  revalidatePath('/[locale]/gallery', 'page');
  redirect('/admin/albums');
}

export async function actionAssignMedia(mediaId: string, albumId: string) {
  await assignMediaToAlbum(mediaId, albumId || null);
  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/admin/albums', 'page');
}
