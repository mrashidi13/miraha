import { prisma } from '@/lib/prisma';

export function getPlaces() {
  return prisma.place.findMany({ orderBy: { createdAt: 'asc' } });
}

export function getPlaceById(id: string) {
  return prisma.place.findUnique({ where: { id } });
}

export function createPlace(data: {
  nameEn: string;
  nameFa: string;
  descriptionEn?: string;
  descriptionFa?: string;
  lat?: number | null;
  lng?: number | null;
  imageUrls?: string[];
}) {
  return prisma.place.create({ data });
}

export function updatePlace(id: string, data: {
  nameEn?: string;
  nameFa?: string;
  descriptionEn?: string;
  descriptionFa?: string;
  lat?: number | null;
  lng?: number | null;
  imageUrls?: string[];
}) {
  return prisma.place.update({ where: { id }, data });
}

export function deletePlace(id: string) {
  return prisma.place.delete({ where: { id } });
}
