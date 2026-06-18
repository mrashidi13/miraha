'use server';

import { revalidatePath } from 'next/cache';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/db/announcements';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import type { AnnouncementType } from '@prisma/client';

async function assertAdmin() {
  const u = await getServerUser();
  if (!u) throw new Error('Unauthorized');
  const db = await getUserById(u.id);
  if (!db || db.role !== 'admin') throw new Error('Forbidden');
}

export async function actionCreateAnnouncement(formData: FormData) {
  await assertAdmin();
  const expiresRaw = formData.get('expiresAt') as string;
  await createAnnouncement({
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    bodyEn: (formData.get('bodyEn') as string) || undefined,
    bodyFa: (formData.get('bodyFa') as string) || undefined,
    type: (formData.get('type') as AnnouncementType) || 'general',
    active: formData.get('active') === 'true',
    expiresAt: expiresRaw ? new Date(expiresRaw) : null,
  });
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/announcements', 'page');
}

export async function actionToggleAnnouncement(id: string, active: boolean) {
  await assertAdmin();
  await updateAnnouncement(id, { active });
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/announcements', 'page');
}

export async function actionDeleteAnnouncement(id: string) {
  await assertAdmin();
  await deleteAnnouncement(id);
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/announcements', 'page');
}
