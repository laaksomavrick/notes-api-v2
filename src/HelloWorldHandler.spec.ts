import * as express from "express";
import { Request } from "jest-express/lib/request";
import { Response } from "jest-express/lib/response";
import { Database } from "../lib/database";
import { HelloWorldHandler } from "./HelloWorldHandler";

describe("Handlers test", () => {
    let req: express.Request;
    let res: express.Response;
    let database: Database;

    beforeEach(() => {
        // Casts required to satisfy strict mode typings
        req = (new Request() as unknown) as express.Request;
        res = (new Response() as unknown) as express.Response;
        database = (jest.fn() as unknown) as Database;
    });

    afterEach(() => {
        ((req as unknown) as Response).resetMocked();
        ((res as unknown) as Response).resetMocked();
    });

    describe("HelloWorldHandler", () => {
        const helloWorldHandler = new HelloWorldHandler();
        const handler = helloWorldHandler.getHandler();

        it("hello, worlds", () => {
            handler(req, res);

            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ resource: { hello: "world" } });
        });
    });
});
