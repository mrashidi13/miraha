'use server';

import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import { updateCommentSettings } from '@/lib/db/settings';

async function assertAdmin() {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) throw new Error('Unauthenticated');
  const dbUser = await getUserById(supabaseUser.id);
  if (!dbUser || dbUser.role !== 'admin') throw new Error('Forbidden');
}

export async function actionToggleCommentSection(
  field: 'wordsEnabled' | 'proverbsEnabled' | 'newsEnabled',
  value: boolean,
) {
  await assertAdmin();
  await updateCommentSettings({ [field]: value });
  revalidatePath('/[locale]/admin/comments', 'page');
}
