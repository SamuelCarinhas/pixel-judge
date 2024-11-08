import { NextFunction, Request, Response } from "express";
import postService from "../services/post.service";
import { StatusCodes } from "http-status-codes";

export async function getPosts(req: Request, res: Response, next: NextFunction) {
    postService
        .getPosts()
        .then((posts) => res.status(StatusCodes.OK).json({ message: "Posts retrieved", posts }))
        .catch((error) => next(error))
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    postService
        .getPost(id as string)
        .then((post) => res.status(StatusCodes.OK).json({ message: "Post retrieved", post }))
        .catch((error) => next(error))
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
    const { title, content } = req.body;

    postService
        .createPost(res.locals.account, title, content)
        .then((post) => res.status(StatusCodes.CREATED).json({ message: "Post created", post }))
        .catch((error) => next(error))
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;
    const { title, content } = req.body;

    postService
        .updatePost(res.locals.account, id as string, title, content)
        .then((post) => res.status(StatusCodes.OK).json({ message: "Post updated", post }))
        .catch((error) => next(error))
}

export async function like(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    postService
        .like(res.locals.account, id as string)
        .then(() => res.status(StatusCodes.OK).json({ message: "Liked the post" }))
        .catch((error) => next(error))
}

export async function unlike(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    postService
        .unlike(res.locals.account, id as string)
        .then(() => res.status(StatusCodes.OK).json({ message: "Unliked the post" }))
        .catch((error) => next(error))
}

export async function getHomePosts(req: Request, res: Response, next: NextFunction) {
    postService
        .getHomePosts()
        .then((posts) => res.status(StatusCodes.OK).json({ message: "Posts retrieved", posts }))
        .catch((error) => next(error))
}

export async function changeHomePagePost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;
    const { homePage } = req.body;

    postService
        .changeHomePagePost(res.locals.account, id as string, homePage)
        .then((post) => res.status(StatusCodes.OK).json({ message: "Post updated", post }))
        .catch((error) => next(error))
}

export default {
    getPost,
    getPosts,
    createPost,
    updatePost,
    like,
    unlike,
    getHomePosts,
    changeHomePagePost
}