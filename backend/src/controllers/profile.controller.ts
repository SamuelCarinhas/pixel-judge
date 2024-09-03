import { NextFunction, Request, Response } from "express"
import profileService from "../services/profile.service"
import { StatusCodes } from "http-status-codes"

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query;

    profileService
        .getProfile(username as string)
        .then((profile) => res.status(StatusCodes.OK).json({ message: "Account retrieved", account: profile }))
        .catch((error) => next(error))
}

export async function getProfiles(req: Request, res: Response, next: NextFunction) {
    profileService
        .getProfiles()
        .then((profiles) => res.status(StatusCodes.OK).json({ message: "Accounts retrieved", profiles }))
        .catch((error) => next(error))
}

export async function followProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;

    profileService
        .followProfile(res.locals.token.accountId, username)
        .then(() => res.status(StatusCodes.OK).json({message: "Account followed"}))
        .catch((error) => next(error));
}

export async function unfollowProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    
    profileService
        .unfollowProfile(res.locals.token.accountId, username)
        .then(() => res.status(StatusCodes.OK).json({message: "Account unfollowed"}))
        .catch((error) => next(error));
}

export async function isFollowing(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    
    profileService
        .isFollowing(res.locals.token.accountId, username)
        .then((following) => res.status(StatusCodes.OK).json({ following }))
        .catch((error) => next(error));
}

export default {
    getProfile,
    getProfiles,
    followProfile,
    unfollowProfile,
    isFollowing
}
