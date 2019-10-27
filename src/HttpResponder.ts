import { Response } from "express";
import { Database } from "../lib/database";
import { HttpError } from "./HttpError";

export abstract class HttpResponder {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

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
