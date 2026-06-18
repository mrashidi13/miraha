import { prisma } from '@/lib/prisma';
import type { ContentStatus } from '@prisma/client';

export function getSuperstitions(status: ContentStatus = 'approved') {
  return prisma.superstition.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
  });
}

export function getAllSuperstitions() {
  return prisma.superstition.findMany({ orderBy: { createdAt: 'desc' } });
}

export function getSuperstitionById(id: string) {
  return prisma.superstition.findUnique({ where: { id } });
}

export function createSuperstition(data: {
  textEn: string;
  textFa: string;
  explanationEn?: string;
  explanationFa?: string;
  category?: string;
  status?: ContentStatus;
}) {
  return prisma.superstition.create({ data });
}

export function updateSuperstition(id: string, data: {
  textEn?: string;
  textFa?: string;
  explanationEn?: string;
  explanationFa?: string;
  category?: string;
  status?: ContentStatus;
}) {
  return prisma.superstition.update({ where: { id }, data });
}

export function deleteSuperstition(id: string) {
  return prisma.superstition.delete({ where: { id } });
}
