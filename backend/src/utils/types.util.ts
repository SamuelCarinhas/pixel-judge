import { Account, Profile, Role } from "@prisma/client";
import { NextFunction } from "express";

export type AccessToken = { accountId: string; username: string; email: string; role: Role }
export type RefreshToken = { accountId: string }
export type VerificationToken = { accountId: string; code: string }
export type PasswordResetToken = { accountId: string; code: string }

export type Token = RefreshToken | AccessToken
export type onTokenDecoded = (token: Token, next: NextFunction) => Promise<void>

export type VerificationEmailPayload = { username: string; callback: string }
export type ResetPasswordEmailPayload = { username: string; callback: string }

export type AccountWithProfile = Account & { profile: Profile };
