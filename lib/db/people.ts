import { prisma } from '@/lib/prisma';

export function getPeople() {
  return prisma.person.findMany({ orderBy: { nameEn: 'asc' } });
}

export function getPerson(id: string) {
  return prisma.person.findUnique({ where: { id } });
}

export function createPerson(data: {
  nameEn: string; nameFa: string;
  roleEn?: string; roleFa?: string;
  locationEn?: string; locationFa?: string;
  photoUrl?: string;
}) {
  return prisma.person.create({ data });
}

export function updatePerson(id: string, data: Partial<Parameters<typeof createPerson>[0]>) {
  return prisma.person.update({ where: { id }, data });
}

export function deletePerson(id: string) {
  return prisma.person.delete({ where: { id } });
}
