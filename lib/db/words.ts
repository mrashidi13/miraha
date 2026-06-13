import { prisma } from '@/lib/prisma';
import type { ContentStatus } from '@prisma/client';

export function getWords(opts: { search?: string; status?: ContentStatus } = {}) {
  const { search, status = 'approved' } = opts;
  return prisma.word.findMany({
    where: {
      status,
      ...(search
        ? {
            OR: [
              { term: { contains: search, mode: 'insensitive' } },
              { meaningEn: { contains: search, mode: 'insensitive' } },
              { meaningFa: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { term: 'asc' },
  });
}

export function getWord(id: string) {
  return prisma.word.findUnique({ where: { id } });
}

export function createWord(data: {
  term: string;
  pronunciation?: string;
  meaningEn: string;
  meaningFa: string;
  exampleEn?: string;
  exampleFa?: string;
  audioUrl?: string;
  photoUrl?: string;
  status?: ContentStatus;
  submittedById?: string;
}) {
  return prisma.word.create({ data });
}

export function updateWord(id: string, data: Partial<Parameters<typeof createWord>[0]>) {
  return prisma.word.update({ where: { id }, data });
}

export function deleteWord(id: string) {
  return prisma.word.delete({ where: { id } });
}
