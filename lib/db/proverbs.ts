import { prisma } from '@/lib/prisma';
import type { ContentStatus } from '@prisma/client';

export function getProverbs(status: ContentStatus = 'approved') {
  return prisma.proverb.findMany({ where: { status }, orderBy: { createdAt: 'desc' } });
}

export function getProverb(id: string) {
  return prisma.proverb.findUnique({ where: { id } });
}

export function createProverb(data: {
  textEn: string; textFa: string;
  meaningEn: string; meaningFa: string;
  usageEn?: string; usageFa?: string;
  audioUrl?: string;
  status?: ContentStatus;
  submittedById?: string;
}) {
  return prisma.proverb.create({ data });
}

export function updateProverb(id: string, data: Partial<Parameters<typeof createProverb>[0]>) {
  return prisma.proverb.update({ where: { id }, data });
}

export function deleteProverb(id: string) {
  return prisma.proverb.delete({ where: { id } });
}
