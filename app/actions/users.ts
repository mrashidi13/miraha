'use server';

import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById, updateUserPermissions } from '@/lib/db/users';
import type { UserRole } from '@prisma/client';

async function assertAdmin() {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) throw new Error('Unauthenticated');
  const dbUser = await getUserById(supabaseUser.id);
  if (!dbUser || dbUser.role !== 'admin') throw new Error('Forbidden');
}

export async function actionSetUserRole(userId: string, role: UserRole) {
  await assertAdmin();
  await updateUserPermissions(userId, { role });
  revalidatePath('/[locale]/admin/users', 'page');
}

export async function actionTogglePermission(
  userId: string,
  field: 'canPublishWords' | 'canPublishProverbs' | 'canPublishMedia' | 'canModerateComments',
  value: boolean,
) {
  await assertAdmin();
  await updateUserPermissions(userId, { [field]: value });
  revalidatePath('/[locale]/admin/users', 'page');
}
