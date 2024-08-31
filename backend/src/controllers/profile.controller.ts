import { NextFunction, Request, Response } from "express"
import profileService from "../services/profile.service"
import { StatusCodes } from "http-status-codes"

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query

    profileService
        .getProfile(username as string)
        .then((profile) => res.status(StatusCodes.OK).json({ message: "Account retrieved", profile }))
        .catch((error) => next(error))
}

export default {
    getProfile
}
