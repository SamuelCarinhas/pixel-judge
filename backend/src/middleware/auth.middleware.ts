import { NextFunction, Request, Response } from "express";
import { AccessToken, AccountWithProfile, onTokenDecoded, PasswordResetToken, RefreshToken } from "../utils/types.util";
import { Forbidden, InternalServerError, Unauthorized } from "../utils/error.util";
import prisma from "../utils/prisma.util";
import { verifyJWT } from "../services/auth.service";
import { Account, Profile } from "@prisma/client";

const JWT_ACCESS_SECRET = String(process.env.JWT_ACCESS_SECRET)
const JWT_UTIL_SECRET = String(process.env.JWT_UTIL_SECRET)
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET)

const verifyAccessToken = <T>(token: string) => verifyJWT<T>(token, JWT_ACCESS_SECRET);
const verifyVerificationToken = <T>(token: string) => verifyJWT<T>(token, JWT_UTIL_SECRET);
const verifyRefreshToken = <T>(token: string) => verifyJWT<T>(token, JWT_REFRESH_SECRET);
const verifyResetToken = <T>(token: string) => verifyJWT<T>(token, JWT_UTIL_SECRET);

export const extractToken = (req: Request, cookie?: string): string => {
    return (req.headers.authorization || (cookie ? req.signedCookies[cookie] : "") || "").replace(
        /Bearer\s/,
        ""
    )
}

async function getAccountById(accountId: string): Promise<AccountWithProfile | null> {
    try {
        const user = await prisma.account.findUnique({
            where: {
                id: accountId,
            },
            include: {
                profile: true
            }
        }) as AccountWithProfile;
        return user;
    } catch (error) {
        console.error('Error fetching username by accountId:', error);
        throw error;
    }
}

const authorize = (decoder: any, cookie?: string, onTokenDecoded?: onTokenDecoded) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req, cookie);
        if (!token) {
            return next(new Unauthorized(`No token was provided in the authorization header`))
        }
        const decoded = decoder(token);
        if (decoded) {
            res.locals.originalToken = token;
            res.locals.token = decoded;
            res.locals.account = await getAccountById(decoded.accountId);
            if(res.locals.account === null) return next(new InternalServerError("Account not found"));
            if(res.locals.account.profile === null) return next(new Forbidden("Profile not found"));
            return onTokenDecoded ? onTokenDecoded(decoded, next) : next()
        }
        return next(new Unauthorized(`Invalid / Expired Authorization Token. Permission Denied`))
    }
}

export const authorizeAccess = authorize(verifyAccessToken<AccessToken>);
export const authorizeVerification = authorize(verifyVerificationToken<PasswordResetToken>);
export const authorizeRefresh = authorize(verifyRefreshToken<RefreshToken>);
export const authorizeResetPassword = authorize(verifyResetToken<PasswordResetToken>);

export default {
    authorizeAccess,
    authorizeVerification,
    authorizeRefresh,
    authorizeResetPassword
}
