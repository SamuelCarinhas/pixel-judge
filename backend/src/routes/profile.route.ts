import { Router } from "express";
import { validate } from "../utils/validator.util";
import { FollowProfile, GetProfileSchema } from "../models/profile.model";
import profileController from "../controllers/profile.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router()

router.get('/', validate(GetProfileSchema), profileController.getProfile)
router.get('/all', profileController.getProfiles)
router.post('/follow', authMiddleware.authorizeAccess, validate(FollowProfile), profileController.followProfile)
router.delete('/unfollow', authMiddleware.authorizeAccess, validate(FollowProfile), profileController.unfollowProfile)

export default router
