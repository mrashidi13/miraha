import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient() {
  // max=1 prevents connection exhaustion on Supabase free tier in serverless
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
