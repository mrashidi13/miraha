import { prisma } from '@/lib/prisma';

export function getFavorite(userId: string, wordId: string) {
  return prisma.favorite.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });
}

export function getFavoritesByUser(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { word: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function toggleFavorite(userId: string, wordId: string) {
  const existing = await getFavorite(userId, wordId);
  if (existing) {
    await prisma.favorite.delete({ where: { userId_wordId: { userId, wordId } } });
    return false;
  }
  await prisma.favorite.create({ data: { userId, wordId } });
  return true;
}
