import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { BadRequest } from "../utils/error.util";
import { ProfileImageMulter } from "../utils/multer.util";

export function uploadProfilePhoto() {
    return (req: Request, res: Response, next: NextFunction) => {
        const upload = ProfileImageMulter.single("file");
        upload(req, res, (err) => {
            if(err instanceof MulterError) return next(new BadRequest(err.message));
            if(err) next(err);
            if(req.file === null || req.file === undefined)
                return next(new BadRequest("No file uploaded"));
            next();
        })
    }
}

export default {
    uploadProfilePhoto
}