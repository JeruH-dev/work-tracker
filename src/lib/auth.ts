import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { getSessionUserId } from "@/lib/session";
import { signInSchema, signUpSchema } from "@/lib/validators";

export async function registerUser(input: unknown) {
  const data = signUpSchema.parse(input);
  const existingUser = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
  if (existingUser) throw new Error("An account with this email already exists");

  return prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash: await hashPassword(data.password) },
    select: { id: true, name: true, email: true },
  });
}

export async function authenticateUser(input: unknown) {
  const data = signInSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await verifyPassword(data.password, user.passwordHash))) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } });
}
