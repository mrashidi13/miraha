'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPerson, updatePerson, deletePerson } from '@/lib/db/people';

export async function actionCreatePerson(formData: FormData) {
  await createPerson({
    nameEn: formData.get('nameEn') as string,
    nameFa: formData.get('nameFa') as string,
    roleEn: (formData.get('roleEn') as string) || undefined,
    roleFa: (formData.get('roleFa') as string) || undefined,
    locationEn: (formData.get('locationEn') as string) || undefined,
    locationFa: (formData.get('locationFa') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/people', 'page');
  redirect('/en/admin/people');
}

export async function actionUpdatePerson(id: string, formData: FormData) {
  await updatePerson(id, {
    nameEn: formData.get('nameEn') as string,
    nameFa: formData.get('nameFa') as string,
    roleEn: (formData.get('roleEn') as string) || undefined,
    roleFa: (formData.get('roleFa') as string) || undefined,
    locationEn: (formData.get('locationEn') as string) || undefined,
    locationFa: (formData.get('locationFa') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
  });
  revalidatePath('/[locale]/people', 'page');
  redirect('/en/admin/people');
}

export async function actionDeletePerson(id: string) {
  await deletePerson(id);
  revalidatePath('/[locale]/people', 'page');
  redirect('/en/admin/people');
}
