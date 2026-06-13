import { prisma } from '@/lib/prisma';
import type { MediaType } from '@prisma/client';

export function getMedia(type?: MediaType) {
  return prisma.mediaItem.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export function createMediaItem(data: {
  type: MediaType; url: string;
  captionEn?: string; captionFa?: string;
  takenAt?: Date;
}) {
  return prisma.mediaItem.create({ data });
}

export function deleteMediaItem(id: string) {
  return prisma.mediaItem.delete({ where: { id } });
}
