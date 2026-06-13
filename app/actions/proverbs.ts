'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProverb, updateProverb, deleteProverb } from '@/lib/db/proverbs';

export async function actionCreateProverb(formData: FormData) {
  const p = await createProverb({
    textEn: formData.get('textEn') as string,
    textFa: formData.get('textFa') as string,
    meaningEn: formData.get('meaningEn') as string,
    meaningFa: formData.get('meaningFa') as string,
    usageEn: (formData.get('usageEn') as string) || undefined,
    usageFa: (formData.get('usageFa') as string) || undefined,
    audioUrl: (formData.get('audioUrl') as string) || undefined,
    status: 'approved',
  });
  revalidatePath('/[locale]/proverbs', 'page');
  redirect(`/en/admin/proverbs/${p.id}`);
}

export async function actionUpdateProverb(id: string, formData: FormData) {
  await updateProverb(id, {
    textEn: formData.get('textEn') as string,
    textFa: formData.get('textFa') as string,
    meaningEn: formData.get('meaningEn') as string,
    meaningFa: formData.get('meaningFa') as string,
    usageEn: (formData.get('usageEn') as string) || undefined,
    usageFa: (formData.get('usageFa') as string) || undefined,
    audioUrl: (formData.get('audioUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/proverbs', 'page');
  redirect('/en/admin/proverbs');
}

export async function actionDeleteProverb(id: string) {
  await deleteProverb(id);
  revalidatePath('/[locale]/proverbs', 'page');
  redirect('/en/admin/proverbs');
}
