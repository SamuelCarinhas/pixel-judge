import { Request, Response, NextFunction } from "express";
import authService  from "../services/auth.service";
import logger from "../utils/logger.util";
import mailService from '../services/mail.service'
import { StatusCodes } from "http-status-codes";
import { PasswordResetToken, RefreshToken, VerificationToken } from "../utils/types.util";

export async function signUp(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body

    authService.signUp(username, email, password)
        .then(accountId => {
            logger.info(`Account ${email} created`)
            res.status(StatusCodes.CREATED).json({
                message: `Account created`,
                accountId
            })
        })
        .catch(error => next(error))
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body

    authService.signIn(username, password)
        .then(({ email, username, accessToken, refreshToken, role }) => {
            logger.info(`Account ${username} logged in`)
            res.status(StatusCodes.OK).json({
                message: "Login successful!",
                email,
                username,
                accessToken,
                refreshToken,
                role
            })
        })
        .catch(error => next(error))
}

export async function refreshToken(_req: Request, res: Response, next: NextFunction) {
    const token: RefreshToken = res.locals.token
    const originalToken: string = res.locals.originalToken

    authService.refreshToken(token.accountId, originalToken)
        .then(({ accessToken, refreshToken }) => {
            res.status(StatusCodes.OK).json({
                message: "Token refreshed successfully!",
                accessToken: accessToken,
                refreshToken: refreshToken,
            })
        })
        .catch((error) => next(error))
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    const token: PasswordResetToken = res.locals.token

    const { password } = req.body

    authService
        .resetPassword(token.accountId, token.code, password)
        .then(() => res.status(StatusCodes.OK).json({ message: "Password reset successful!" }))
        .catch((error) => next(error))
}

export async function askResetPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body

    mailService
        .reset(email)
        .then(() => res.status(StatusCodes.OK).json({ message: "Password Reset Email Sent!" }))
        .catch((error) => next(error))
}

export async function verifyAccount(_req: Request, res: Response, next: NextFunction) {
    const token: VerificationToken = res.locals.token
    authService
        .verifyAccount(token.accountId, token.code)
        .then(() => res.status(StatusCodes.OK).json({ message: "Account verified successfully!" }))
        .catch((error) => next(error))
}

export default { signUp, signIn, refreshToken, resetPassword, askResetPassword, verifyAccount }