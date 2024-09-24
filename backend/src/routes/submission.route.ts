import { Router } from "express";
import { validate } from "../utils/validator.util";
import authMiddleware from "../middleware/auth.middleware";
import { AdminProblemGetSchema } from "../models/admin.model";
import problemMiddleware from "../middleware/problem.middleware";
import submissionController from "../controllers/submission.controller";
import { GetProfileSchema } from "../models/profile.model";
import { GetPageQuery } from "../models/page.model";

const router = Router()

router.get('/', validate(AdminProblemGetSchema), submissionController.getSubmissionInfo)
router.get('/all', validate(GetPageQuery), submissionController.getAllSubmissions)
router.get('/user', validate(GetProfileSchema), submissionController.getUserSubmissions)
router.get('/problem', validate(AdminProblemGetSchema), submissionController.getProblemSubmissions)
router.get('/', authMiddleware.authorizeAccess, validate(AdminProblemGetSchema), submissionController.getMyProblemSubmissions)
router.get('/my-recent-problem', authMiddleware.authorizeAccess, validate(AdminProblemGetSchema), submissionController.getRecentProblemSubmissions)

export default router
