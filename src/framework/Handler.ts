import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./HttpError";
import { HttpResponder } from "./HttpResponder";
import { Repository } from "./Repository";

export type HandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export abstract class Handler extends HttpResponder {
    protected handlers: HandlerFn[] = [];

    public getHandlers(): HandlerFn[] {
        return this.handlers.map((handler: HandlerFn) => this.handleErrors(handler));
    }

    protected abstract handle(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> | void;

    protected handleErrors(fn: HandlerFn): HandlerFn {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                await fn(req, res, next);
            } catch (e) {
                next(e);
            }
        };
    }

    protected requireAuth(): HandlerFn {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new UnauthorizedError();
            }

            const [_, token] = authHeader.split("Bearer ");

            if (!token) {
                throw new UnauthorizedError();
            }

            const decoded = decode(token);

            if (!decoded) {
                throw new UnauthorizedError();
            }

            // TODO better way to do this
            // TODO: type guard
            // tslint:disable-next-line:no-any
            const userId = (decoded as any).id;

            // TODO: type guard
            // tslint:disable-next-line:no-any
            (req as any).userId = userId;

            // await fn(req, res, next);
            next();
        };
    }

    protected getUserId(req: Request): number {
        // tslint:disable-next-line:no-any
        const userId = (req as any).userId;

        if (userId) {
            return userId;
        } else {
            throw new UnauthorizedError();
        }
    }

    protected getParamId(req: Request, field: string): number | undefined {
        const id = req.params[field];

        if (id) {
            return parseInt(id, 10);
        }

        return undefined;
    }
}
