import { Router } from "express";
import { validate } from "../utils/validator.util";
import authMiddleware from "../middleware/auth.middleware";
import problemController from "../controllers/problem.controller";
import { AdminProblemGetSchema } from "../models/admin.model";
import problemMiddleware from "../middleware/problem.middleware";

const router = Router()

router.get('/', validate(AdminProblemGetSchema), problemController.getProblem)
router.get('/all', problemController.getProblems)
router.post('/submit', authMiddleware.authorizeAccess, validate(AdminProblemGetSchema), problemMiddleware.uploadSubmission(), problemController.submitSolution)

export default router
