'use server';

import { revalidatePath } from 'next/cache';
import { createSuperstition, updateSuperstition, deleteSuperstition } from '@/lib/db/superstitions';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';

async function assertAdmin() {
  const u = await getServerUser();
  if (!u) throw new Error('Unauthorized');
  const db = await getUserById(u.id);
  if (!db || db.role !== 'admin') throw new Error('Forbidden');
}

export async function actionCreateSuperstition(formData: FormData) {
  await assertAdmin();
  await createSuperstition({
    textEn: formData.get('textEn') as string,
    textFa: formData.get('textFa') as string,
    explanationEn: (formData.get('explanationEn') as string) || '',
    explanationFa: (formData.get('explanationFa') as string) || '',
    category: (formData.get('category') as string) || '',
    status: 'approved',
  });
  revalidatePath('/[locale]/superstitions', 'page');
  revalidatePath('/[locale]/admin/superstitions', 'page');
}

export async function actionUpdateSuperstition(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  await updateSuperstition(id, {
    textEn: formData.get('textEn') as string,
    textFa: formData.get('textFa') as string,
    explanationEn: (formData.get('explanationEn') as string) || '',
    explanationFa: (formData.get('explanationFa') as string) || '',
    category: (formData.get('category') as string) || '',
  });
  revalidatePath('/[locale]/superstitions', 'page');
  revalidatePath('/[locale]/admin/superstitions', 'page');
}

export async function actionDeleteSuperstition(id: string) {
  await assertAdmin();
  await deleteSuperstition(id);
  revalidatePath('/[locale]/superstitions', 'page');
  revalidatePath('/[locale]/admin/superstitions', 'page');
}
