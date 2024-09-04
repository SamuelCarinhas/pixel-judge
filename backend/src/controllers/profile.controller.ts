import { NextFunction, Request, Response } from "express"
import profileService from "../services/profile.service"
import { StatusCodes } from "http-status-codes"
import { BadRequest } from "../utils/error.util";

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
    const { username } = req.query;

    profileService
        .followProfile(res.locals.account, username as string)
        .then(() => res.status(StatusCodes.OK).json({message: "Account followed"}))
        .catch((error) => next(error));
}

export async function unfollowProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query;
    
    profileService
        .unfollowProfile(res.locals.account, username as string)
        .then(() => res.status(StatusCodes.OK).json({message: "Account unfollowed"}))
        .catch((error) => next(error));
}

export async function isFollowing(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query;
    
    profileService
        .isFollowing(res.locals.account, username as string)
        .then((following) => res.status(StatusCodes.OK).json({ following }))
        .catch((error) => next(error));
}

export async function getFollowers(req: Request, res: Response, next: NextFunction) {
    profileService
        .getFollowers(res.locals.account)
        .then((followers) => res.status(StatusCodes.OK).json({ followers }))
        .catch((error) => next(error));
}

export async function getFollowing(req: Request, res: Response, next: NextFunction) {
    profileService
        .getFollowing(res.locals.account)
        .then((following) => res.status(StatusCodes.OK).json({ following }))
        .catch((error) => next(error));
}

export async function updateProfilePicture(req: Request, res: Response, next: NextFunction) {
    const file = req.file;
    if(!file) throw new BadRequest("File not found");

    profileService
        .updateProfilePicture(res.locals.account, file)
        .then(() => res.status(StatusCodes.OK).json({ message: "File uploaded" }))
        .catch((err) => next(err));
}

export async function getProfilePicture(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query;

    profileService
        .getProfilePicture(username as string)
        .then((path) => res.status(StatusCodes.OK).sendFile(path))
        .catch((err) => next(err));
}

export default {
    getProfile,
    getProfiles,
    followProfile,
    unfollowProfile,
    isFollowing,
    getFollowers,
    getFollowing,
    updateProfilePicture,
    getProfilePicture
}
