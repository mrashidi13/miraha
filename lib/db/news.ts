import { prisma } from '@/lib/prisma';

export function getAllNews() {
  return prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });
}

export function getNewsItem(id: string) {
  return prisma.news.findUnique({ where: { id } });
}

export function createNews(data: {
  titleEn: string; titleFa: string;
  bodyEn: string; bodyFa: string;
  imageUrl?: string;
  publishedAt?: Date;
}) {
  return prisma.news.create({ data });
}

export function updateNews(id: string, data: Partial<Parameters<typeof createNews>[0]>) {
  return prisma.news.update({ where: { id }, data });
}

export function deleteNews(id: string) {
  return prisma.news.delete({ where: { id } });
}
