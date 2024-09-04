import { Router } from "express";
import { validate } from "../utils/validator.util";
import { GetProfileSchema } from "../models/profile.model";
import profileController from "../controllers/profile.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router()

router.get('/', validate(GetProfileSchema), profileController.getProfile)
router.get('/all', profileController.getProfiles)
router.post('/follow', authMiddleware.authorizeAccess, validate(GetProfileSchema), profileController.followProfile)
router.delete('/unfollow', authMiddleware.authorizeAccess, validate(GetProfileSchema), profileController.unfollowProfile)
router.get('/is-following', authMiddleware.authorizeAccess, validate(GetProfileSchema), profileController.isFollowing)
router.get('/followers', authMiddleware.authorizeAccess, profileController.getFollowers)
router.get('/following', authMiddleware.authorizeAccess, profileController.getFollowing)

export default router
