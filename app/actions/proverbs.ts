'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProverb, updateProverb, deleteProverb } from '@/lib/db/proverbs';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';

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
  redirect(`/admin/proverbs/${p.id}`);
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
  redirect('/admin/proverbs');
}

export async function actionDeleteProverb(id: string) {
  await deleteProverb(id);
  revalidatePath('/[locale]/proverbs', 'page');
  redirect('/admin/proverbs');
}

export async function actionApproveProverb(id: string) {
  await updateProverb(id, { status: 'approved' });
  revalidatePath('/[locale]/proverbs', 'page');
  redirect('/admin/proverbs');
}

export async function actionRejectProverb(id: string) {
  await deleteProverb(id);
  revalidatePath('/[locale]/proverbs', 'page');
  redirect('/admin/proverbs');
}

export async function actionSuggestProverb(locale: string, formData: FormData) {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) redirect(`/${locale}/login`);

  const dbUser = await getUserById(supabaseUser.id);
  const canPublish = dbUser?.role === 'admin' || dbUser?.canPublishProverbs === true;

  const textEn = (formData.get('textEn') as string).trim();
  const meaningEn = (formData.get('meaningEn') as string).trim();
  const usageFa = (formData.get('usageFa') as string).trim();

  await createProverb({
    textFa: formData.get('textFa') as string,
    textEn: textEn || '—',
    meaningFa: formData.get('meaningFa') as string,
    meaningEn: meaningEn || '—',
    usageFa: usageFa || undefined,
    status: canPublish ? 'approved' : 'pending',
    submittedById: supabaseUser.id,
  });

  redirect(`/${locale}/proverbs?suggested=1`);
}
