import crypto from "crypto";
import prisma from "../utils/prisma.util";
import {InternalServerError, NotFound} from "../utils/error.util";
import { Account } from "@prisma/client";
import { signJWT } from "./auth.service";
import Mailer from "../utils/mail.utils";
import {PasswordResetToken} from "../utils/types.util";

const JWT_UTIL_SECRET = String(process.env.JWT_UTIL_SECRET)

const SMTP_EMAIL = String(process.env.SMPT_EMAIL)

const nanoid = (size: number = 48) => crypto.randomBytes(size).toString("base64url")

async function createVerificationToken(account: Account): Promise<string> {
    const payload = { accountId: account.id, code: nanoid() }

    await prisma.account.update({
        where: { id: account.id },
        data: { verificationCode: payload.code },
    })

    return signJWT(payload, JWT_UTIL_SECRET)
}

async function createPasswordResetToken(account: Account): Promise<string> {
    const payload: PasswordResetToken = { accountId: account.id, code: nanoid() }

    await prisma.account.update({
        where: { id: account.id },
        data: { passwordResetCode: payload.code },
    })

    return signJWT(payload, JWT_UTIL_SECRET, {
        expiresIn: `60m`,
    })
}


export async function verify(callback: string, email: string) {
    const account = await prisma.account.findUnique({ where: { email } })
    if (account === null) {
        throw new NotFound(`The with email ${email} does not have an account`)
    }
    const token = await createVerificationToken(account)
    const mailer = new Mailer(SMTP_EMAIL, email)

    await mailer.sendVerifyAccountMail({
        username: account.username,
        callback: `${callback}?token=${token}`,
    })
        .catch(err => { throw new InternalServerError(err) })
}

export async function reset(callback: string, email: string) {
    const account = await prisma.account.findUnique({ where: { email } })
    if (account === null) {
        throw new NotFound(`The with email ${email} does not have an account`)
    }
    const token = await createPasswordResetToken(account)
    const mailer = new Mailer(SMTP_EMAIL, email)

    await mailer.sendResetPasswordMail({
        username: account.username,
        callback: `${callback}?token=${token}`,
    })
        .catch(err => { throw new InternalServerError(err) })
}

export default { verify, reset }