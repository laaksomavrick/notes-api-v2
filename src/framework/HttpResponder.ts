import { Response } from "express";
import { LoggerFactory } from "../../lib/logger";
import { HttpError } from "./HttpError";

interface IHttpResponse {
    resource: object;
    paginate?: IPaginateResponse;
}

interface IPaginateResponse {
    remainingPages: number;
}

export abstract class HttpResponder {
    protected readonly logger = LoggerFactory.getLogger();

    protected httpOk(
        res: Response,
        resource: object,
        paginate?: IPaginateResponse,
        status: number = 200,
    ): void {
        let body: IHttpResponse = { resource };

        if (paginate) {
            body = { ...body, paginate };
        }

        res.status(status).send(body);
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
