import { Prisma } from "@prisma/client";

import { AuthResult, AuthServiceError, createAuthError, createAuthSuccess } from "@/lib/auth-errors";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { getSessionUserId } from "@/lib/session";
import { createVerificationTokenForUser, resendVerificationEmail, sendVerificationEmail } from "@/lib/verification";
import { signInSchema, signUpSchema } from "@/lib/validators";

export async function registerUser(input: unknown) {
  const data = signUpSchema.parse(input);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, name: true, email: true, emailVerified: true },
  });
  if (existingUser?.emailVerified) {
    throw new AuthServiceError("EMAIL_EXISTS", "An account with this email already exists.", 409);
  }

  try {
    if (existingUser) {
      await resendVerificationEmail(existingUser);
      return existingUser;
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: await hashPassword(data.password),
      },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    const token = await createVerificationTokenForUser(user.id);
    await sendVerificationEmail({ name: user.name, email: user.email, token: token.token });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AuthServiceError("EMAIL_EXISTS", "An account with this email already exists.", 409);
    }
    if (error instanceof Error && error.message.includes("verification email")) {
      throw new AuthServiceError(
        "EMAIL_DELIVERY_FAILED",
        "Your account was created, but we could not send the verification email. Check the email service configuration and try again.",
        503,
      );
    }
    throw error;
  }
}

export async function authenticateUser(input: unknown): Promise<AuthResult<{ id: string; name: string; email: string; emailVerified: boolean }>> {
  const data = signInSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    return createAuthError("USER_NOT_FOUND", "No account was found with this email.");
  }

  const passwordValid = await verifyPassword(data.password, user.passwordHash);
  if (!passwordValid) {
    return createAuthError("INVALID_PASSWORD", "The password you entered is incorrect.");
  }

  if (!user.emailVerified) {
    return createAuthError("EMAIL_NOT_VERIFIED", "Please verify your email address before signing in.");
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified };
  return createAuthSuccess("Signed in successfully.", safeUser);
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, emailVerified: true } });
  return user && user.emailVerified ? user : null;
}
