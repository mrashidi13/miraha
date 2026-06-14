'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createComment, approveComment, deleteComment } from '@/lib/db/comments';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import type { TargetType } from '@prisma/client';

async function assertModerator() {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) throw new Error('Unauthenticated');
  const dbUser = await getUserById(supabaseUser.id);
  if (!dbUser || (dbUser.role !== 'admin' && !dbUser.canModerateComments)) {
    throw new Error('Forbidden');
  }
}

const targetPath = (t: TargetType) =>
  t === 'word' ? 'dictionary' : t === 'proverb' ? 'proverbs' : 'news';

export async function actionAddComment(
  targetType: TargetType,
  targetId: string,
  locale: string,
  formData: FormData,
) {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) redirect(locale === 'en' ? '/en/login' : '/login');

  const body = (formData.get('body') as string).trim();
  if (!body) return;

  await createComment({ body, userId: supabaseUser.id, targetType, targetId });

  revalidatePath(`/[locale]/${targetPath(targetType)}/[id]`, 'page');
  const prefix = locale === 'en' ? '/en' : '';
  redirect(`${prefix}/${targetPath(targetType)}/${targetId}?commented=1`);
}

export async function actionApproveComment(id: string, targetType: TargetType, targetId: string) {
  await assertModerator();
  await approveComment(id);
  revalidatePath(`/[locale]/${targetPath(targetType)}/[id]`, 'page');
  revalidatePath('/[locale]/admin/comments', 'page');
}

export async function actionDeleteComment(id: string, targetType: TargetType, targetId: string) {
  await assertModerator();
  await deleteComment(id);
  revalidatePath(`/[locale]/${targetPath(targetType)}/[id]`, 'page');
  revalidatePath('/[locale]/admin/comments', 'page');
}
