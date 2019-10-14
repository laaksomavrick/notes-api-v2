import * as express from "express";
import { Request } from "jest-express/lib/request";
import { Response } from "jest-express/lib/response";
import { helloWorldHandler } from "./handlers";

describe("Handlers test", () => {
    let req: express.Request;
    let res: express.Response;

    beforeEach(() => {
        // Casts required to satisfy strict mode typings
        req = (new Request() as unknown) as express.Request;
        res = (new Response() as unknown) as express.Response;
    });

    afterEach(() => {
        ((req as unknown) as Response).resetMocked();
        ((res as unknown) as Response).resetMocked();
    });

    describe("HelloWorldHandler", () => {
        it("hello, worlds", () => {
            helloWorldHandler(req, res);

            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ hello: "world" });
        });
    });
});
