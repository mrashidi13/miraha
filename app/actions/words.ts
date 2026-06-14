'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createWord, updateWord, deleteWord } from '@/lib/db/words';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';

export async function actionCreateWord(formData: FormData) {
  const word = await createWord({
    term: formData.get('term') as string,
    pronunciation: (formData.get('pronunciation') as string) || undefined,
    meaningEn: formData.get('meaningEn') as string,
    meaningFa: formData.get('meaningFa') as string,
    exampleEn: (formData.get('exampleEn') as string) || undefined,
    exampleFa: (formData.get('exampleFa') as string) || undefined,
    audioUrl: (formData.get('audioUrl') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
    status: 'approved',
  });
  revalidatePath('/[locale]/dictionary', 'page');
  redirect(`/en/admin/words/${word.id}`);
}

export async function actionUpdateWord(id: string, formData: FormData) {
  await updateWord(id, {
    term: formData.get('term') as string,
    pronunciation: (formData.get('pronunciation') as string) || undefined,
    meaningEn: formData.get('meaningEn') as string,
    meaningFa: formData.get('meaningFa') as string,
    exampleEn: (formData.get('exampleEn') as string) || undefined,
    exampleFa: (formData.get('exampleFa') as string) || undefined,
    audioUrl: (formData.get('audioUrl') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/dictionary', 'page');
  redirect('/en/admin/words');
}

export async function actionDeleteWord(id: string) {
  await deleteWord(id);
  revalidatePath('/[locale]/dictionary', 'page');
  redirect('/en/admin/words');
}

export async function actionApproveWord(id: string) {
  await updateWord(id, { status: 'approved' });
  revalidatePath('/[locale]/dictionary', 'page');
  redirect('/en/admin/words');
}

export async function actionRejectWord(id: string) {
  await deleteWord(id);
  revalidatePath('/[locale]/dictionary', 'page');
  redirect('/en/admin/words');
}

export async function actionSuggestWord(locale: string, formData: FormData) {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) redirect(`/${locale}/login`);

  const dbUser = await getUserById(supabaseUser.id);
  const canPublish = dbUser?.role === 'admin' || dbUser?.canPublishWords === true;

  const meaningEn = (formData.get('meaningEn') as string).trim();

  await createWord({
    term: formData.get('term') as string,
    pronunciation: (formData.get('pronunciation') as string) || undefined,
    meaningFa: formData.get('meaningFa') as string,
    meaningEn: meaningEn || '—',
    exampleFa: (formData.get('exampleFa') as string) || undefined,
    exampleEn: (formData.get('exampleEn') as string) || undefined,
    status: canPublish ? 'approved' : 'pending',
    submittedById: supabaseUser.id,
  });

  redirect(`/${locale}/dictionary?suggested=1`);
}
