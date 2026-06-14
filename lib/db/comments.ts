import { prisma } from '@/lib/prisma';
import type { TargetType } from '@prisma/client';

const userSelect = { select: { id: true, name: true, avatarUrl: true } };

export function getApprovedComments(targetType: TargetType, targetId: string) {
  return prisma.comment.findMany({
    where: { targetType, targetId, status: 'approved' },
    include: { user: userSelect },
    orderBy: { createdAt: 'asc' },
  });
}

export function getAllCommentsForTarget(targetType: TargetType, targetId: string) {
  return prisma.comment.findMany({
    where: { targetType, targetId },
    include: { user: userSelect },
    orderBy: { createdAt: 'asc' },
  });
}

export function getPendingComments() {
  return prisma.comment.findMany({
    where: { status: 'pending' },
    include: {
      user: userSelect,
      word: { select: { term: true } },
      proverb: { select: { textEn: true, textFa: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export function createComment(data: {
  body: string; userId: string;
  targetType: TargetType; targetId: string;
}) {
  return prisma.comment.create({ data: { ...data, status: 'pending' } });
}

export function approveComment(id: string) {
  return prisma.comment.update({ where: { id }, data: { status: 'approved' } });
}

export function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
