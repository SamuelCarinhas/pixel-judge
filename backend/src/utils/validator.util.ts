import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "./logger.util";
import { BadRequest } from "./error.util";

export function validate(schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) {
    return async (req: Request, _res: Response, next: NextFunction)=> {
        try {
            await schema.parseAsync({ body: req.body, params: req.params, query: req.query })
            return next()
        } catch (error) {
            logger.error(error)
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    const field = curr.path[1] as string;
                    acc[field] = curr.message;
                    return acc;
                  }, {} as Record<string, string>);
                return next(new BadRequest(formattedErrors))
            }
        }
    }
}
