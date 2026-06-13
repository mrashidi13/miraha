import { prisma } from '@/lib/prisma';
import type { ThemeSettings, HeroSettings, MapSettings, AboutSettings } from '@prisma/client';

// ---- Theme ----
export async function getTheme(): Promise<ThemeSettings> {
  const row = await prisma.themeSettings.findUnique({ where: { id: 1 } });
  if (row) return row;
  return prisma.themeSettings.create({ data: { id: 1 } });
}

export function updateTheme(data: Partial<Omit<ThemeSettings, 'id'>>) {
  return prisma.themeSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}

// ---- Hero ----
export async function getHero(): Promise<HeroSettings> {
  const row = await prisma.heroSettings.findUnique({ where: { id: 1 } });
  if (row) return row;
  return prisma.heroSettings.create({ data: { id: 1 } });
}

export function updateHero(data: Partial<Omit<HeroSettings, 'id'>>) {
  return prisma.heroSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}

// ---- Map ----
export async function getMap(): Promise<MapSettings> {
  const row = await prisma.mapSettings.findUnique({ where: { id: 1 } });
  if (row) return row;
  return prisma.mapSettings.create({ data: { id: 1 } });
}

export function updateMap(data: Partial<Omit<MapSettings, 'id'>>) {
  return prisma.mapSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}

// ---- About ----
export async function getAbout(): Promise<AboutSettings> {
  const row = await prisma.aboutSettings.findUnique({ where: { id: 1 } });
  if (row) return row;
  return prisma.aboutSettings.create({ data: { id: 1 } });
}

export function updateAbout(data: Partial<Omit<AboutSettings, 'id'>>) {
  return prisma.aboutSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}
