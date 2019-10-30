import { NextFunction, Request, Response } from "express";
import { HttpResponder } from "./HttpResponder";

type HandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export abstract class Handler extends HttpResponder {
    protected abstract handle(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> | void;

    protected abstract getHandler(): HandlerFn;

    protected handleErrors(fn: HandlerFn): HandlerFn {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                await fn(req, res, next);
            } catch (e) {
                next(e);
            }
        };
    }
}
