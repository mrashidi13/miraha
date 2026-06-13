'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNews, updateNews, deleteNews } from '@/lib/db/news';

export async function actionCreateNews(formData: FormData) {
  const n = await createNews({
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    bodyEn: formData.get('bodyEn') as string,
    bodyFa: formData.get('bodyFa') as string,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/news', 'page');
  redirect(`/en/admin/news/${n.id}`);
}

export async function actionUpdateNews(id: string, formData: FormData) {
  await updateNews(id, {
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    bodyEn: formData.get('bodyEn') as string,
    bodyFa: formData.get('bodyFa') as string,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/news', 'page');
  redirect('/en/admin/news');
}

export async function actionDeleteNews(id: string) {
  await deleteNews(id);
  revalidatePath('/[locale]/news', 'page');
  redirect('/en/admin/news');
}
