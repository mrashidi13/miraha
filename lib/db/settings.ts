import { prisma } from '@/lib/prisma';
import type { ThemeSettings, HeroSettings, MapSettings, AboutSettings, CommentSettings, HeroSlide } from '@prisma/client';

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

export async function getHeroWithSlides(): Promise<HeroSettings & { slides: HeroSlide[] }> {
  const row = await prisma.heroSettings.findUnique({
    where: { id: 1 },
    include: { slides: { orderBy: { order: 'asc' } } },
  });
  if (row) return row;
  return prisma.heroSettings.create({ data: { id: 1 }, include: { slides: true } });
}

export function createHeroSlide(data: Omit<HeroSlide, 'id' | 'heroId'>) {
  return prisma.heroSlide.create({ data: { ...data, heroId: 1 } });
}

export function updateHeroSlide(id: string, data: Partial<Omit<HeroSlide, 'id' | 'heroId'>>) {
  return prisma.heroSlide.update({ where: { id }, data });
}

export function deleteHeroSlide(id: string) {
  return prisma.heroSlide.delete({ where: { id } });
}

export function updateRotationInterval(rotationInterval: number) {
  return prisma.heroSettings.upsert({
    where: { id: 1 },
    update: { rotationInterval },
    create: { id: 1, rotationInterval },
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

// ---- Comment settings ----
export async function getCommentSettings(): Promise<CommentSettings> {
  const row = await prisma.commentSettings.findUnique({ where: { id: 1 } });
  if (row) return row;
  return prisma.commentSettings.create({ data: { id: 1 } });
}

export function updateCommentSettings(data: Partial<Omit<CommentSettings, 'id'>>) {
  return prisma.commentSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}
