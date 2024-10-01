import { Router } from "express";
import { validate } from "../utils/validator.util";
import adminController from "../controllers/admin.controller";
import { AdminProblemGetSchema, AdminTestCaseVisibility, AdminUpdateProblemSchema, AdminUpdateUserSchem, LanguageSchema } from "../models/admin.model";
import { CreateProblemSchema } from "../models/problem.model";
import adminMiddleware from "../middleware/admin.middleware";

const router = Router()

router.get('/users', adminController.getUsers)
router.post('/user', validate(AdminUpdateUserSchem), adminController.updateUser)
router.get('/logs', adminController.getLogs)

router.post('/problem', validate(CreateProblemSchema), adminController.createProblem)
router.get('/problem', validate(AdminProblemGetSchema), adminController.getProblem)
router.put('/problem', validate(AdminUpdateProblemSchema), adminController.updateProblem)
router.get('/problems', adminController.getProblems)

router.post('/test-case', validate(AdminProblemGetSchema), adminMiddleware.uploadTestCases(), adminController.addTestCase)
router.put('/test-case', validate(AdminProblemGetSchema), adminMiddleware.uploadTestCases(), adminController.editTestCase)
router.put('/test-case/visible', validate(AdminTestCaseVisibility), adminController.changeTestCaseVisibility)
router.delete('/test-case', validate(AdminProblemGetSchema), adminController.removeTestCase)
router.get('/test-cases', validate(AdminProblemGetSchema), adminController.getTestCases)
router.get('/test-case', validate(AdminProblemGetSchema), adminController.getTestCase)

router.get('/language/all', adminController.getLanguages)
router.get('/language', validate(AdminProblemGetSchema), adminController.getLanguage)
router.delete('/language', validate(AdminProblemGetSchema), adminController.deleteLanguage)
router.post('/language', validate(LanguageSchema), adminController.addLanguage)
router.put('/language', validate(LanguageSchema), adminController.updateLanguage)


router.get('/contest/all', adminController.getContests)
router.get('/contest', validate(AdminProblemGetSchema), adminController.getContest)

export default router
