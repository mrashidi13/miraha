'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPerson, updatePerson, deletePerson } from '@/lib/db/people';

function parsePersonForm(formData: FormData) {
  const birthYearRaw = (formData.get('birthYear') as string).trim();
  const deathYearRaw = (formData.get('deathYear') as string).trim();
  const fatherIdRaw = (formData.get('fatherId') as string).trim();
  const motherIdRaw = (formData.get('motherId') as string).trim();
  return {
    nameEn: formData.get('nameEn') as string,
    nameFa: formData.get('nameFa') as string,
    roleEn: (formData.get('roleEn') as string) || undefined,
    roleFa: (formData.get('roleFa') as string) || undefined,
    locationEn: (formData.get('locationEn') as string) || undefined,
    locationFa: (formData.get('locationFa') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
    birthYear: birthYearRaw ? parseInt(birthYearRaw, 10) : undefined,
    deathYear: deathYearRaw ? parseInt(deathYearRaw, 10) : undefined,
    fatherId: fatherIdRaw || undefined,
    motherId: motherIdRaw || undefined,
  };
}

export async function actionCreatePerson(formData: FormData) {
  await createPerson(parsePersonForm(formData));
  revalidatePath('/[locale]/people', 'page');
  revalidatePath('/[locale]/family-tree', 'page');
  redirect('/admin/people');
}

export async function actionUpdatePerson(id: string, formData: FormData) {
  const data = parsePersonForm(formData);
  await updatePerson(id, {
    ...data,
    fatherId: data.fatherId ?? null,
    motherId: data.motherId ?? null,
    birthYear: data.birthYear ?? null,
    deathYear: data.deathYear ?? null,
  } as Parameters<typeof updatePerson>[1]);
  revalidatePath('/[locale]/people', 'page');
  revalidatePath('/[locale]/family-tree', 'page');
  redirect('/admin/people');
}

export async function actionDeletePerson(id: string) {
  await deletePerson(id);
  revalidatePath('/[locale]/people', 'page');
  revalidatePath('/[locale]/family-tree', 'page');
  redirect('/admin/people');
}
