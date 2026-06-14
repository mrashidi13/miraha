'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server';
import { toggleFavorite } from '@/lib/db/favorites';

export async function actionToggleFavorite(wordId: string) {
  const user = await getServerUser();
  if (!user) redirect('/login');
  await toggleFavorite(user.id, wordId);
  revalidatePath('/[locale]/dictionary/[id]', 'page');
  revalidatePath('/[locale]/profile/favorites', 'page');
}
