import { prisma } from '@/lib/prisma';
import type { UserRole } from '@prisma/client';

export function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
}

export function updateUserPermissions(
  id: string,
  data: {
    role?: UserRole;
    canPublishWords?: boolean;
    canPublishProverbs?: boolean;
    canPublishMedia?: boolean;
  },
) {
  return prisma.user.update({ where: { id }, data });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function upsertUserFromAuth(
  supabaseId: string,
  email: string,
  name: string,
  avatarUrl?: string,
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const role: UserRole = email === adminEmail ? 'admin' : 'member';

  return prisma.user.upsert({
    where: { id: supabaseId },
    update: { email, name, avatarUrl },
    create: { id: supabaseId, email, name, avatarUrl, role },
  });
}

export async function ensureAdminRole(supabaseId: string) {
  const user = await getUserById(supabaseId);
  return user?.role === 'admin';
}
