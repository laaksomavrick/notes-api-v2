import { Response } from "express";
import { HttpError } from "./HttpError";

export abstract class HttpResponder {
    protected httpOk(res: Response, resource: object, status: number = 200): void {
        res.status(status).send({
            resource,
        });
    }

    protected httpError(res: Response, error: HttpError, status: number = 500): void {
        res.status(status).send({
            error: {
                errors: error.errors,
                msg: error.toString(),
            },
            status,
        });
    }
}
