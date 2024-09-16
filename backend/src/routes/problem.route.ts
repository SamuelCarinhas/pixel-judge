import { Router } from "express";
import { validate } from "../utils/validator.util";
import authMiddleware from "../middleware/auth.middleware";
import problemController from "../controllers/problem.controller";
import { AdminProblemGetSchema } from "../models/admin.model";

const router = Router()

router.get('/', validate(AdminProblemGetSchema), problemController.getProblem)
router.get('/all', problemController.getProblems)

export default router
