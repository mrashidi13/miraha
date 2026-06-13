import { prisma } from '@/lib/prisma';

export function getEvents(upcoming = false) {
  return prisma.event.findMany({
    where: upcoming ? { startsAt: { gte: new Date() } } : undefined,
    orderBy: { startsAt: 'asc' },
  });
}

export function getEvent(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

export function createEvent(data: {
  titleEn: string; titleFa: string;
  descriptionEn?: string; descriptionFa?: string;
  startsAt: Date; endsAt?: Date;
  location?: string;
}) {
  return prisma.event.create({ data });
}

export function updateEvent(id: string, data: Partial<Parameters<typeof createEvent>[0]>) {
  return prisma.event.update({ where: { id }, data });
}

export function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}
