import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { UnauthorizedError } from "./HttpError";
import { HttpResponder } from "./HttpResponder";

export type HandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export abstract class Handler extends HttpResponder {
    protected handlers: HandlerFn[] = [];

    public getHandlers(): HandlerFn[] {
        return this.handlers.map((handler: HandlerFn) =>
            this.handleErrors(this.logRequest(handler)),
        );
    }

    protected abstract handle(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> | void;

    protected logRequest(fn: HandlerFn): HandlerFn {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const httpMethod = req.method;
                const url = req.url;
                const loggable = { params: JSON.stringify(req.params), body: req.body };
                this.logger.info(`${httpMethod} ${url}`, loggable);
                await fn(req, res, next);
            } catch (e) {
                next(e);
            }
        };
    }

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
