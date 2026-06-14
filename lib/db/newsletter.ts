import { prisma } from '@/lib/prisma';

export function getSubscribers(activeOnly = true) {
  return prisma.newsletterSubscriber.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { subscribedAt: 'desc' },
  });
}

export function getSubscriberByEmail(email: string) {
  return prisma.newsletterSubscriber.findUnique({ where: { email } });
}

export function createSubscriber(data: { email: string; name?: string; locale: string }) {
  return prisma.newsletterSubscriber.upsert({
    where: { email: data.email },
    update: { active: true, name: data.name, locale: data.locale },
    create: { ...data },
  });
}

export function deactivateSubscriber(email: string) {
  return prisma.newsletterSubscriber.update({ where: { email }, data: { active: false } });
}

export function deleteSubscriber(id: string) {
  return prisma.newsletterSubscriber.delete({ where: { id } });
}

export function countSubscribers() {
  return prisma.newsletterSubscriber.count({ where: { active: true } });
}
