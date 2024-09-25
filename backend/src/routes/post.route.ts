import { Router } from "express";
import { validate } from "../utils/validator.util";
import authMiddleware from "../middleware/auth.middleware";
import { AdminProblemGetSchema } from "../models/admin.model";
import postController from "../controllers/post.controller";
import { PostHomePageSchema, PostSchema } from "../models/post.model";

const router = Router()

router.get('/', validate(AdminProblemGetSchema), postController.getPost)
router.get('/all', postController.getPosts)
router.post('/', authMiddleware.authorizeAccess, validate(PostSchema), postController.createPost)
router.post('/like', authMiddleware.authorizeAccess, validate(AdminProblemGetSchema), postController.like)
router.post('/unlike', authMiddleware.authorizeAccess, validate(AdminProblemGetSchema), postController.unlike)

router.get('/home', postController.getHomePosts)
router.put('/home-page', authMiddleware.authorizeAdmin, validate(PostHomePageSchema), postController.changeHomePagePost)

export default router
