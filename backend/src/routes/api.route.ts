import express, { Router } from "express"
import cookieParser from "cookie-parser"

import authRoute from "./auth.route"
import profileRoute from "./profile.route"
import adminRoute from "./admin.route"
import problemRoute from "./problem.route"
import apiMiddleware from "../middleware/api.middleware"
import apiController from "../controllers/api.controller"
import hpp from "hpp"
import helmet from "helmet"
import cors from "cors"
import authMiddleware from "../middleware/auth.middleware"

const router = Router()

router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
router.use(express.json())
router.use(cors({ origin: '*', credentials: true }))
router.use(express.urlencoded({ extended: true }))
router.use(cookieParser('TESTE'))
router.use(hpp())

router.use('/auth/', authRoute)
router.use('/profile/', profileRoute)
router.use('/admin/', authMiddleware.authorizeAdmin, adminRoute)
router.use('/problem/', problemRoute)

router.get("/", apiController.root)
router.get("/health-check", apiController.health)

router.use(apiMiddleware.errorHandler)

export default router
