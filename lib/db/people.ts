import { prisma } from '@/lib/prisma';

const withRelations = {
  include: {
    father: { select: { id: true, nameEn: true, nameFa: true } },
    mother: { select: { id: true, nameEn: true, nameFa: true } },
    childrenAsFather: { select: { id: true, nameEn: true, nameFa: true } },
    childrenAsMother: { select: { id: true, nameEn: true, nameFa: true } },
  },
} as const;

export function getPeople() {
  return prisma.person.findMany({ orderBy: { nameEn: 'asc' } });
}

export function getPeopleWithRelations() {
  return prisma.person.findMany({ ...withRelations, orderBy: { nameEn: 'asc' } });
}

export function getPerson(id: string) {
  return prisma.person.findUnique({ where: { id } });
}

export type PersonCreateData = {
  nameEn: string; nameFa: string;
  roleEn?: string; roleFa?: string;
  locationEn?: string; locationFa?: string;
  photoUrl?: string;
  birthYear?: number; deathYear?: number;
  fatherId?: string; motherId?: string;
};

export function createPerson(data: PersonCreateData) {
  return prisma.person.create({ data });
}

export function updatePerson(id: string, data: Partial<PersonCreateData>) {
  return prisma.person.update({ where: { id }, data });
}

export function deletePerson(id: string) {
  return prisma.person.delete({ where: { id } });
}
