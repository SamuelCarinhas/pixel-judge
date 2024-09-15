import { Router } from "express";
import { validate } from "../utils/validator.util";
import { CreateProblemSchema } from "../models/problem.model";
import authMiddleware from "../middleware/auth.middleware";
import problemController from "../controllers/problem.controller";

const router = Router()


export default router
