import { prisma } from '@/lib/prisma';

export function getAlbums() {
  return prisma.album.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      media: {
        where: { type: 'photo' },
        orderBy: { createdAt: 'asc' },
        take: 1,
        select: { url: true },
      },
      _count: { select: { media: true } },
    },
  });
}

export function getAlbum(id: string) {
  return prisma.album.findUnique({
    where: { id },
    include: {
      media: { where: { type: 'photo' }, orderBy: { createdAt: 'asc' } },
    },
  });
}

export function createAlbum(data: {
  titleEn: string; titleFa: string;
  descriptionEn?: string; descriptionFa?: string;
  coverUrl?: string;
}) {
  return prisma.album.create({ data });
}

export function updateAlbum(id: string, data: Partial<Parameters<typeof createAlbum>[0]>) {
  return prisma.album.update({ where: { id }, data });
}

export function deleteAlbum(id: string) {
  return prisma.album.delete({ where: { id } });
}

export function assignMediaToAlbum(mediaId: string, albumId: string | null) {
  return prisma.mediaItem.update({ where: { id: mediaId }, data: { albumId } });
}
