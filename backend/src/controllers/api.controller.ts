import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

import apiService from "../services/api.service"

export async function root(req: Request, res: Response, _next: NextFunction) {
    return res.redirect("/health-check")
}

export async function health(req: Request, res: Response, _next: NextFunction) {
    return apiService.health().then(() => {
        res.status(StatusCodes.OK).json({
            message: "Service Healthy",
            uptime: process.uptime().toLocaleString(),
            date: new Date(),
        })
    })
}

export default { root, health }
