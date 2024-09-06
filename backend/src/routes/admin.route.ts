import { Router } from "express";
import { validate } from "../utils/validator.util";
import { GetProfileSchema } from "../models/profile.model";
import adminController from "../controllers/admin.controller";

const router = Router()

router.get('/users', adminController.getUsers)

export default router
