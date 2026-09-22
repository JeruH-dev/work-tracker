import { NextResponse } from "next/server";

export type AuthErrorCode =
  | "EMAIL_EXISTS"
  | "USER_NOT_FOUND"
  | "INVALID_PASSWORD"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_DISABLED"
  | "EMAIL_DELIVERY_FAILED"
  | "REGISTRATION_FAILED"
  | "AUTH_FAILED";

export type AuthSuccessPayload<TUser = unknown> = {
  success: true;
  message: string;
  user?: TUser;
};

export type AuthErrorPayload = {
  success: false;
  code: AuthErrorCode;
  message: string;
};

export type AuthResult<TUser = unknown> = AuthSuccessPayload<TUser> | AuthErrorPayload;

export const authStatusByCode: Record<AuthErrorCode, number> = {
  EMAIL_EXISTS: 409,
  USER_NOT_FOUND: 401,
  INVALID_PASSWORD: 401,
  EMAIL_NOT_VERIFIED: 403,
  ACCOUNT_DISABLED: 403,
  EMAIL_DELIVERY_FAILED: 503,
  REGISTRATION_FAILED: 500,
  AUTH_FAILED: 500,
};

export function createAuthError(code: AuthErrorCode, message: string): AuthErrorPayload {
  return { success: false, code, message };
}

export function createAuthSuccess<TUser = unknown>(message: string, user?: TUser): AuthSuccessPayload<TUser> {
  return user ? { success: true, message, user } : { success: true, message };
}

export function createAuthResponse<TUser = unknown>(result: AuthResult<TUser>) {
  return NextResponse.json(result, {
    status: result.success ? 200 : authStatusByCode[result.code],
  });
}

export class AuthServiceError extends Error {
  code: AuthErrorCode;
  statusCode: number;

  constructor(code: AuthErrorCode, message: string, statusCode = 400) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
    this.statusCode = statusCode;
  }
}
