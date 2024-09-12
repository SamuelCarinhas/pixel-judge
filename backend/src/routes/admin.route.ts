import { Router } from "express";
import { validate } from "../utils/validator.util";
import { GetProfileSchema } from "../models/profile.model";
import adminController from "../controllers/admin.controller";
import { AdminUpdateUserSchem } from "../models/admin.model";

const router = Router()

router.get('/users', adminController.getUsers)
router.post('/user', validate(AdminUpdateUserSchem), adminController.updateUser)
router.post('/admin-logs', adminController.getAdminLogs)

export default router
