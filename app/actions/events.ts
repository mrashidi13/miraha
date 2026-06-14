'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEvent, updateEvent, deleteEvent } from '@/lib/db/events';

export async function actionCreateEvent(formData: FormData) {
  await createEvent({
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || undefined,
    descriptionFa: (formData.get('descriptionFa') as string) || undefined,
    startsAt: new Date(formData.get('startsAt') as string),
    endsAt: formData.get('endsAt') ? new Date(formData.get('endsAt') as string) : undefined,
    location: (formData.get('location') as string) || undefined,
  });
  revalidatePath('/[locale]/events', 'page');
  redirect('/admin/events');
}

export async function actionUpdateEvent(id: string, formData: FormData) {
  await updateEvent(id, {
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    descriptionEn: (formData.get('descriptionEn') as string) || undefined,
    descriptionFa: (formData.get('descriptionFa') as string) || undefined,
    startsAt: new Date(formData.get('startsAt') as string),
    endsAt: formData.get('endsAt') ? new Date(formData.get('endsAt') as string) : undefined,
    location: (formData.get('location') as string) || undefined,
  });
  revalidatePath('/[locale]/events', 'page');
  redirect('/admin/events');
}

export async function actionDeleteEvent(id: string) {
  await deleteEvent(id);
  revalidatePath('/[locale]/events', 'page');
  redirect('/admin/events');
}
