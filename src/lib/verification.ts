import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { Resend } from "resend";

import { prisma } from "@/lib/db";

const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 1;
const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function createVerificationTokenForUser(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  return prisma.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

export async function verifyEmailToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true, emailVerified: true } } },
  });

  if (!record) return null;
  if (record.expiresAt.getTime() <= Date.now()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { expired: true, user: record.user };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: record.userId }, data: { emailVerified: true } });
    await tx.verificationToken.deleteMany({ where: { userId: record.userId } });
  });

  return { expired: false, user: record.user };
}

export async function sendVerificationEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!apiKey || !emailFrom) {
    throw new Error("Email verification is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const resend = new Resend(apiKey);
  const verificationUrl = `${getAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;

  const { error } = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: "Verify your Work Tracker account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17221d;">
        <h2>Work Tracker</h2>
        <p>Hello ${name},</p>
        <p>Your account has been created, but it still needs to be verified before you can sign in.</p>
        <p><a href="${verificationUrl}" style="background: #1d6b4f; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; display: inline-block;">Verify email</a></p>
        <p>If the button does not work, use this link instead:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This verification link expires in 1 hour.</p>
      </div>
    `,
    text: `Hello ${name},\n\nYour Work Tracker account needs to be verified before you can sign in.\n\nVerify your email: ${verificationUrl}\n\nThis link expires in 1 hour.`,
  });

  if (error) {
    throw new Error(`Unable to send verification email: ${error.message}`);
  }

  return { skipped: false };
}

export async function resendVerificationEmail(user: { id: string; name: string; email: string }) {
  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
  const token = await createVerificationTokenForUser(user.id);
  await sendVerificationEmail({ name: user.name, email: user.email, token: token.token });
}

export async function createPasswordResetTokenForUser(userId: string) {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });
  return prisma.passwordResetToken.create({
    data: {
      token: crypto.randomBytes(32).toString("hex"),
      userId,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS),
    },
  });
}

export async function sendPasswordResetEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!apiKey || !emailFrom) {
    throw new Error("Password reset email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const resend = new Resend(apiKey);
  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const { error } = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: "Reset your Work Tracker password",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17221d;"><h2>Work Tracker</h2><p>Hello ${name},</p><p>We received a request to reset your password.</p><p><a href="${resetUrl}" style="background: #1d6b4f; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset password</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p><p><a href="${resetUrl}">${resetUrl}</a></p></div>`,
    text: `Hello ${name},\n\nReset your Work Tracker password here: ${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
  });

  if (error) throw new Error(`Unable to send password reset email: ${error.message}`);
}

export async function resetPasswordWithToken(token: string, passwordHash: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return "invalid" as const;
  if (record.expiresAt.getTime() <= Date.now()) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return "expired" as const;
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ]);
  return "reset" as const;
}

export async function deleteExpiredVerificationTokensForUser(userId: string) {
  await prisma.verificationToken.deleteMany({
    where: {
      userId,
      expiresAt: { lt: new Date() },
    },
  });
}

export function isVerificationTokenError(value: unknown) {
  return value instanceof Prisma.PrismaClientKnownRequestError && value.code === "P2025";
}
