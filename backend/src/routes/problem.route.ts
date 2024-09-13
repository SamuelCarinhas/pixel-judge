import { Router } from "express";
import { validate } from "../utils/validator.util";
import { CreateProblemSchema } from "../models/problem.model";
import authMiddleware from "../middleware/auth.middleware";
import problemController from "../controllers/problem.controller";

const router = Router()

router.post('/', authMiddleware.authorizeAdmin, validate(CreateProblemSchema), problemController.createProblem)
router.get('/all', authMiddleware.authorizeAdmin, problemController.getProblems)


export default router
