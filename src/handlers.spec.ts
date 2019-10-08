import { Response } from "express";
import { helloWorldHandler } from "./handlers";

describe("Handlers test", () => {
    // tslint:disable-next-line:no-any
    let req: any;
    // tslint:disable-next-line:no-any
    let res: any;

    beforeEach(() => {
        req = {};
        res = {};
        res.json = jest.fn();
    });

    describe("HelloWorldHandler", () => {
        it("hello, worlds", () => {
            helloWorldHandler(req, res as Response);

            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ hello: "world" });
        });
    });
});
