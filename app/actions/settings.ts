'use server';

import { revalidatePath } from 'next/cache';
import {
  updateTheme,
  updateHero,
  updateMap,
  updateAbout,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateRotationInterval,
} from '@/lib/db/settings';

export async function actionUpdateTheme(formData: FormData) {
  await updateTheme({
    colorPrimary: formData.get('colorPrimary') as string,
    colorPrimaryLight: formData.get('colorPrimaryLight') as string,
    colorAccent: formData.get('colorAccent') as string,
    colorAccentHover: formData.get('colorAccentHover') as string,
    colorBg: formData.get('colorBg') as string,
    colorText: formData.get('colorText') as string,
    colorTextMuted: formData.get('colorTextMuted') as string,
    fontHeading: formData.get('fontHeading') as string,
    fontBody: formData.get('fontBody') as string,
  });
  revalidatePath('/[locale]', 'layout');
}

export async function actionUpdateHero(formData: FormData) {
  const imageUrls = (formData.get('imageUrls') as string)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  await updateHero({
    imageUrls,
    eyebrowEn: formData.get('eyebrowEn') as string,
    eyebrowFa: formData.get('eyebrowFa') as string,
    titleEn: formData.get('titleEn') as string,
    titleFa: formData.get('titleFa') as string,
    subtitleEn: formData.get('subtitleEn') as string,
    subtitleFa: formData.get('subtitleFa') as string,
  });
  revalidatePath('/[locale]', 'page');
}

export async function actionUpdateMap(formData: FormData) {
  await updateMap({
    embedUrl: formData.get('embedUrl') as string,
    directionsTextEn: formData.get('directionsTextEn') as string,
    directionsTextFa: formData.get('directionsTextFa') as string,
  });
  revalidatePath('/[locale]/map', 'page');
}

export async function actionUpdateAbout(formData: FormData) {
  await updateAbout({
    bodyEn: formData.get('bodyEn') as string,
    bodyFa: formData.get('bodyFa') as string,
  });
  revalidatePath('/[locale]/about', 'page');
}

export async function actionAddHeroSlide(formData: FormData) {
  const order = parseInt(formData.get('order') as string, 10) || 0;
  await createHeroSlide({
    imageUrl: formData.get('imageUrl') as string,
    eyebrowEn: (formData.get('eyebrowEn') as string) || '',
    eyebrowFa: (formData.get('eyebrowFa') as string) || '',
    titleEn: (formData.get('titleEn') as string) || '',
    titleFa: (formData.get('titleFa') as string) || '',
    subtitleEn: (formData.get('subtitleEn') as string) || '',
    subtitleFa: (formData.get('subtitleFa') as string) || '',
    order,
  });
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/hero', 'page');
}

export async function actionUpdateHeroSlide(formData: FormData) {
  const id = formData.get('id') as string;
  await updateHeroSlide(id, {
    imageUrl: formData.get('imageUrl') as string,
    eyebrowEn: (formData.get('eyebrowEn') as string) || '',
    eyebrowFa: (formData.get('eyebrowFa') as string) || '',
    titleEn: (formData.get('titleEn') as string) || '',
    titleFa: (formData.get('titleFa') as string) || '',
    subtitleEn: (formData.get('subtitleEn') as string) || '',
    subtitleFa: (formData.get('subtitleFa') as string) || '',
    order: parseInt(formData.get('order') as string, 10) || 0,
  });
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/hero', 'page');
}

export async function actionDeleteHeroSlide(id: string) {
  await deleteHeroSlide(id);
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/admin/hero', 'page');
}

export async function actionUpdateRotationInterval(formData: FormData) {
  const ms = parseInt(formData.get('rotationInterval') as string, 10);
  if (!isNaN(ms) && ms >= 1000) {
    await updateRotationInterval(ms);
    revalidatePath('/[locale]', 'page');
  }
}
