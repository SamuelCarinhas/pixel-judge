import prisma from "../utils/prisma.util";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {Conflict, InternalServerError, NotFound, Unauthorized} from "../utils/error.util";
import { Account } from "@prisma/client";
import {verify} from "./mail.service";

const JWT_ACCESS_SECRET = String(process.env.JWT_ACCESS_SECRET)
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET)

const JWT_ACCESS_DURATION = Number(process.env.JWT_ACCESS_DURATION)
const JWT_REFRESH_DURATION = Number(process.env.JWT_REFRESH_DURATION)

const SIGN_UP_CALLBACK = String(process.env.SIGN_UP_CALLBACK)

export function signJWT(payload: Object, secret: string, options?: jwt.SignOptions | undefined) {
    const key = Buffer.from(secret, "base64").toString("ascii")
    return jwt.sign(payload, key, { ...(options && options) })
}

export function verifyJWT<T>(token: string, secret: string): T | null {
    const key = Buffer.from(secret, "base64").toString("ascii")
    try {
        return jwt.verify(token, key) as T
    } catch (err) {
        return null
    }
}

const createAccessToken = (account: Account) => {
    const payload = {
        accountId: account.id,
        role: account.role,
        email: account.email,
        user: account.username
    }
    return signJWT(payload, JWT_ACCESS_SECRET, {
        expiresIn: `${JWT_ACCESS_DURATION}m`,
        audience: "urn:jwt:type:access",
        issuer: "urn:system:token-issuer:type:access",
    })
}

const createRefreshToken = (account: Account) => {
    const payload = { accountId: account.id }
    return signJWT(payload, JWT_REFRESH_SECRET, {
        expiresIn: `${JWT_REFRESH_DURATION}m`,
        audience: "urn:jwt:type:refresh",
        issuer: "urn:system:token-issuer:type:refresh",
    })
}

export async function signUp(username: string, email: string, password: string) {
    const usernameExists = await prisma.account.findUnique({
            where: {
                username
            }
        }
    );

    if(usernameExists) throw new Conflict({ username: 'Username already taken.'});

    const account = await prisma.account
        .create({
            data: {
                username,
                email,
                password: await argon2.hash(password)
            }
        }).catch(() => { throw new Conflict({ email: 'Email already in use.' }) })

    await verify(SIGN_UP_CALLBACK, account.email);

    return account.id
}

export async function signIn(username: string, password: string) {
    let account = await prisma.account.findUnique({
        where: {
            email: username
        }
    })

    if(!account) {
        account = await prisma.account.findUnique({
            where: {
                username: username
            }
        })
    }

    if (!account) {
        throw new NotFound("Invalid credentials")
    }

    const validPassword = await argon2.verify(account.password, password)

    if (!validPassword) {
        throw new Unauthorized("Invalid credentials")
    }

    if (!account.verified) {
        throw new Unauthorized(`This account is not verified`)
    }

    const accessToken = createAccessToken(account)
    const refreshToken = createRefreshToken(account)

    await prisma.account.update({
        where: { id: account.id },
        data: {
            refreshToken
        },
    })

    const role = account.role;

    return {
        email: account.email,
        username: account.username,
        accessToken,
        refreshToken,
        role
    }
}

export async function refreshToken(accountId: string, token: string) {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
    })

    if (account === null) {
        throw new InternalServerError('No account found')
    }

    if(account.refreshToken !== token)
        throw new Unauthorized("This refresh token is no longer valid")

    const accessToken = createAccessToken(account)
    const refreshToken = createRefreshToken(account)

    await prisma.account.update({
        where: { id: account.id },
        data: {
            refreshToken
        },
    })

    return { accessToken, refreshToken }
}

export async function verifyAccount(accountId: string, code: string) {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
    })

    if (account === null) {
        throw new InternalServerError('No account found')
    }

    if (account.verificationCode === null) {
        throw new Unauthorized('No verification token has been emitted')
    }

    if (code !== account.verificationCode) {
        throw new Unauthorized('The verification token is invalid/expired or has already been used')
    }

    await prisma.account.update({
        where: { id: account.id },
        data: {
            verified: true,
            verificationCode: null,
            verifiedAt: new Date(),
        },
    })

    await prisma.profile.create({
        data: {
            accountId: account.id
        }
    })
}

export async function resetPassword(accountId: string, code: string, password: string) {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
    })

    if (account === null) {
        throw new InternalServerError('No account found')
    }

    if (account.passwordResetCode === null) {
        throw new Unauthorized('No password reset token has been emitted')
    }

    if (code !== account.passwordResetCode) {
        throw new Unauthorized('The password reset token is invalid/expired or has already been used')
    }

    await prisma.account.update({
        where: { id: account.id },
        data: {
            password: await argon2.hash(password),
            passwordResetCode: null,
            passwordResetAt: new Date(),
        },
    })
}

export default { signUp, signIn, refreshToken, verifyAccount, resetPassword }