import { Router } from "express";
import { validate } from "../utils/validator.util";
import { GetProfileSchema } from "../models/profile.model";
import profileController from "../controllers/profile.controller";

const router = Router()

router.get('/', validate(GetProfileSchema), profileController.getProfile)
router.get('/all', profileController.getProfiles)

export default router
