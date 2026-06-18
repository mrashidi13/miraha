import { prisma } from '@/lib/prisma';
import type { AnnouncementType } from '@prisma/client';

export function getActiveAnnouncements() {
  const now = new Date();
  return prisma.announcement.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
  });
}

export function getAllAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
}

export function createAnnouncement(data: {
  titleEn: string;
  titleFa: string;
  bodyEn?: string;
  bodyFa?: string;
  type: AnnouncementType;
  active: boolean;
  expiresAt?: Date | null;
}) {
  return prisma.announcement.create({ data });
}

export function updateAnnouncement(
  id: string,
  data: {
    titleEn?: string;
    titleFa?: string;
    bodyEn?: string;
    bodyFa?: string;
    type?: AnnouncementType;
    active?: boolean;
    expiresAt?: Date | null;
  },
) {
  return prisma.announcement.update({ where: { id }, data });
}

export function deleteAnnouncement(id: string) {
  return prisma.announcement.delete({ where: { id } });
}
