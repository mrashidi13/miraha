import { prisma } from '@/lib/prisma';
import type { MediaType } from '@prisma/client';

export function getMedia(type?: MediaType, albumId?: string | null) {
  return prisma.mediaItem.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(albumId !== undefined ? { albumId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function createMediaItem(data: {
  type: MediaType; url: string;
  captionEn?: string; captionFa?: string;
  takenAt?: Date; albumId?: string;
}) {
  return prisma.mediaItem.create({ data });
}

export function updateMediaItem(id: string, data: { albumId?: string | null }) {
  return prisma.mediaItem.update({ where: { id }, data });
}

export function deleteMediaItem(id: string) {
  return prisma.mediaItem.delete({ where: { id } });
}
