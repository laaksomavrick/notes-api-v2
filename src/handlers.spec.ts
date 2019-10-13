// import { Response } from "express";
import * as express from "express";
import { Response } from "jest-express/lib/response";
import { helloWorldHandler } from "./handlers";

describe("Handlers test", () => {
    // tslint:disable-next-line:no-any
    let req: any;
    let res: express.Response;

    beforeEach(() => {
        req = {};
        // Required to satisfy strict mode typings
        res = new Response() as unknown as express.Response;
    });

    afterEach(() => {
        (res as unknown as Response).resetMocked();
    });

    describe("HelloWorldHandler", () => {
        it("hello, worlds", () => {
            helloWorldHandler(req, res);

            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ hello: "world" });
        });
    });
});
