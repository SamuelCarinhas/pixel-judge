import { NextFunction, Request, Response } from "express";
import { onTokenDecoded, PasswordResetToken, RefreshToken } from "../utils/types.util";
import { Forbidden } from "../utils/error.util";
import prisma from "../utils/prisma.util";
import { verifyJWT } from "../services/auth.service";

const JWT_UTIL_SECRET = String(process.env.JWT_UTIL_SECRET)
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET)

const verifyVerificationToken = <T>(token: string) => verifyJWT<T>(token, JWT_UTIL_SECRET);
const verifyRefreshToken = <T>(token: string) => verifyJWT<T>(token, JWT_REFRESH_SECRET);
const verifyResetToken = <T>(token: string) => verifyJWT<T>(token, JWT_UTIL_SECRET);

export const extractToken = (req: Request, cookie?: string): string => {
    return (req.headers.authorization || (cookie ? req.signedCookies[cookie] : "") || "").replace(
        /Bearer\s/,
        ""
    )
}

async function getUsernameByAccountId(accountId: string): Promise<string | null> {
    try {
        const user = await prisma.account.findUnique({
            where: {
                id: accountId,
            }
        });
        return user?.username || null;
    } catch (error) {
        console.error('Error fetching username by accountId:', error);
        throw error;
    }
}

const authorize = (decoder: any, cookie?: string, onTokenDecoded?: onTokenDecoded) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req, cookie);
        if (!token) {
            return next(new Forbidden(`No token was provided in the authorization header`))
        }
        const decoded = decoder(token);
        if (decoded) {
            res.locals.originalToken = token;
            res.locals.token = decoded;
            res.locals.token.username = await getUsernameByAccountId(decoded.accountId);
            return onTokenDecoded ? onTokenDecoded(decoded, next) : next()
        }
        return next(new Forbidden(`Invalid / Expired Authorization Token. Permission Denied`))
    }
}

export const authorizeVerification = authorize(verifyVerificationToken<PasswordResetToken>);
export const authorizeRefresh = authorize(verifyRefreshToken<RefreshToken>);
export const authorizeResetPassword = authorize(verifyResetToken<PasswordResetToken>);

export default { authorizeVerification, authorizeRefresh, authorizeResetPassword }
