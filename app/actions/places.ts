'use server';

import { revalidatePath } from 'next/cache';
import { createPlace, updatePlace, deletePlace } from '@/lib/db/places';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';

async function assertAdmin() {
  const u = await getServerUser();
  if (!u) throw new Error('Unauthorized');
  const db = await getUserById(u.id);
  if (!db || db.role !== 'admin') throw new Error('Forbidden');
}

export async function actionCreatePlace(formData: FormData) {
  await assertAdmin();
  const imageUrls = (formData.get('imageUrls') as string)
    .split('\n').map((s) => s.trim()).filter(Boolean);
  await createPlace({
    nameEn: formData.get('nameEn') as string,
    nameFa: formData.get('nameFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || '',
    descriptionFa: (formData.get('descriptionFa') as string) || '',
    lat: formData.get('lat') ? parseFloat(formData.get('lat') as string) : null,
    lng: formData.get('lng') ? parseFloat(formData.get('lng') as string) : null,
    imageUrls,
  });
  revalidatePath('/[locale]/places', 'page');
  revalidatePath('/[locale]/admin/places', 'page');
}

export async function actionUpdatePlace(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  const imageUrls = (formData.get('imageUrls') as string)
    .split('\n').map((s) => s.trim()).filter(Boolean);
  await updatePlace(id, {
    nameEn: formData.get('nameEn') as string,
    nameFa: formData.get('nameFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || '',
    descriptionFa: (formData.get('descriptionFa') as string) || '',
    lat: formData.get('lat') ? parseFloat(formData.get('lat') as string) : null,
    lng: formData.get('lng') ? parseFloat(formData.get('lng') as string) : null,
    imageUrls,
  });
  revalidatePath('/[locale]/places', 'page');
  revalidatePath('/[locale]/admin/places', 'page');
}

export async function actionDeletePlace(id: string) {
  await assertAdmin();
  await deletePlace(id);
  revalidatePath('/[locale]/places', 'page');
  revalidatePath('/[locale]/admin/places', 'page');
}
