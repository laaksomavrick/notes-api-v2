import { Request, Response } from "express";
import { Database } from "../lib/database";
import { Handler } from "./Handler";

export class HelloWorldHandler extends Handler {
    public path = "*";

    constructor(database: Database) {
        super(database);
    }

    public handle(req: Request, res: Response): void {
        this.httpOk(res, { hello: "world" });
    }
}
