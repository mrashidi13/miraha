'use server';

import { revalidatePath } from 'next/cache';
import { updateTheme, updateHero, updateMap, updateAbout } from '@/lib/db/settings';

export async function actionUpdateTheme(formData: FormData) {
  await updateTheme({
    colorPrimary: formData.get('colorPrimary') as string,
    colorPrimaryLight: formData.get('colorPrimaryLight') as string,
    colorAccent: formData.get('colorAccent') as string,
    colorAccentHover: formData.get('colorAccentHover') as string,
    colorBg: formData.get('colorBg') as string,
    colorText: formData.get('colorText') as string,
    colorTextMuted: formData.get('colorTextMuted') as string,
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
