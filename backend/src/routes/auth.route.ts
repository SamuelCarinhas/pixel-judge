import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../utils/validator.util";
import { AskResetPasswordSchema, ResetPasswordSchema, SignInSchema, SignUpSchema } from "../models/auth.model";
import authMiddleware from "../middleware/auth.middleware";

const router = Router()

router.post('/sign-in', validate(SignInSchema), authController.signIn)

router.post('/sign-up', validate(SignUpSchema), authController.signUp)

router.post('/refresh-token', authMiddleware.authorizeRefresh, authController.refreshToken)

router.post('/verify-account', authMiddleware.authorizeVerification, authController.verifyAccount)

router.post('/ask-reset-password', validate(AskResetPasswordSchema), authController.askResetPassword)

router.post('/reset-password', authMiddleware.authorizeResetPassword, validate(ResetPasswordSchema), authController.resetPassword)

// TODO: DELETE ACCOUNT

// TODO: RESEND-VERIFICATION

export default router
