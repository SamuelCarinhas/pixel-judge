import { Router } from "express";
import { validate } from "../utils/validator.util";
import adminController from "../controllers/admin.controller";
import { AdminUpdateProblemSchema, AdminUpdateUserSchem } from "../models/admin.model";
import authMiddleware from "../middleware/auth.middleware";
import { CreateProblemSchema } from "../models/problem.model";

const router = Router()

router.get('/users', adminController.getUsers)
router.post('/user', validate(AdminUpdateUserSchem), adminController.updateUser)
router.get('/logs', adminController.getLogs)

router.post('/problem', authMiddleware.authorizeAdmin, validate(CreateProblemSchema), adminController.createProblem)
router.get('/problem', authMiddleware.authorizeAdmin, adminController.getProblems)
router.put('/problem', authMiddleware.authorizeAdmin, validate(AdminUpdateProblemSchema), adminController.updateProblem)


router.get('/problems', authMiddleware.authorizeAdmin, adminController.getProblems)

export default router
