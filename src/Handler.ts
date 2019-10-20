import { Request, Response } from "express";
import { HttpError } from "./HttpError";

export abstract class Handler {
    public abstract readonly path: string;

    public abstract handle(req: Request, res: Response): Promise<void> | void;

    public httpOk(res: Response, resource: object, status: number = 200): void {
        res.status(status).send({
            resource,
        });
    }

    public httpError(res: Response, error: HttpError, status: number = 500): void {
        res.status(status).send({
            error: {
                errors: error.errors,
                msg: error.toString(),
            },
            status,
        });
    }
}
