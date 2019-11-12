import { Response } from "express";
import { LoggerFactory } from "../../lib/logger";
import { HttpError } from "./HttpError";

export abstract class HttpResponder {
    private readonly logger = LoggerFactory.getLogger();

    protected httpOk(res: Response, resource: object, status: number = 200): void {
        res.status(status).send({
            resource,
        });
    }

    protected httpError(res: Response, error: HttpError, status: number = 500): void {
        if (status === 500) {
            this.logger.error(error.toString(), error.stack);
        }
        res.status(status).send({
            error: {
                errors: error.errors,
                msg: error.toString(),
            },
            status,
        });
    }
}
