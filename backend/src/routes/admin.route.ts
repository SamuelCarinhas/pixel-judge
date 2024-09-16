import { Router } from "express";
import { validate } from "../utils/validator.util";
import adminController from "../controllers/admin.controller";
import { AdminProblemGetSchema, AdminUpdateProblemSchema, AdminUpdateUserSchem } from "../models/admin.model";
import { CreateProblemSchema } from "../models/problem.model";

const router = Router()

router.get('/users', adminController.getUsers)
router.post('/user', validate(AdminUpdateUserSchem), adminController.updateUser)
router.get('/logs', adminController.getLogs)

router.post('/problem', validate(CreateProblemSchema), adminController.createProblem)
router.get('/problem', validate(AdminProblemGetSchema), adminController.getProblem)
router.put('/problem', validate(AdminUpdateProblemSchema), adminController.updateProblem)
router.get('/problems', adminController.getProblems)

export default router
